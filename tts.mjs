/**
 * TTS Engine — Supports edge-tts (free) or Qwen3 TTS (Colab API)
 * 
 * Usage:
 *   node tts.mjs --engine edge --text "Hello" --output audio.mp3
 *   node tts.mjs --engine qwen3 --url https://xxx.ngrok.io --text "Hello" --speaker Ryan --output audio.wav
 *   node tts.mjs --engine qwen3 --url https://xxx.ngrok.io --scenes scenes.json --output-dir /tmp/audio/
 */

import {execSync} from 'child_process';
import {writeFileSync, readFileSync, mkdirSync, existsSync} from 'fs';
import {resolve} from 'path';

function getArg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 && process.argv[idx + 1] ? process.argv[idx + 1] : null;
}

const engine = getArg('engine') || 'edge';
const qwenUrl = getArg('url') || process.env.QWEN3_TTS_URL || '';
const text = getArg('text') || '';
const speaker = getArg('speaker') || 'Ryan';
const voice = getArg('voice') || 'en-US-GuyNeural';
const instruct = getArg('instruct') || '';
const output = getArg('output') || '/tmp/tts_output.wav';
const scenesFile = getArg('scenes');
const outputDir = getArg('output-dir') || '/tmp/tts_scenes';

async function edgeTTS(text, outputPath, voice = 'en-US-GuyNeural') {
  const escaped = text.replace(/"/g, '\\"');
  execSync(`edge-tts --voice '${voice}' --rate='+5%' --text "${escaped}" --write-media "${outputPath}"`, {
    stdio: 'pipe',
    timeout: 30000,
  });
  return outputPath;
}

async function qwen3TTS(text, outputPath, options = {}) {
  if (!qwenUrl) throw new Error('Qwen3 TTS URL not set. Use --url or QWEN3_TTS_URL env var.');
  
  const response = await fetch(`${qwenUrl}/tts`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      text,
      speaker: options.speaker || 'Ryan',
      language: options.language || 'English',
      instruct: options.instruct || '',
      format: 'base64',
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Qwen3 TTS failed: ${err}`);
  }

  const data = await response.json();
  const audioBuffer = Buffer.from(data.audio_base64, 'base64');
  writeFileSync(outputPath, audioBuffer);
  console.log(`  Generated ${data.duration?.toFixed(1)}s audio → ${outputPath}`);
  return outputPath;
}

async function qwen3BatchTTS(scenes, outputDir, options = {}) {
  if (!qwenUrl) throw new Error('Qwen3 TTS URL not set.');

  const response = await fetch(`${qwenUrl}/tts/batch`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      scenes: scenes.map(s => ({
        text: s.narration || s.text,
        speaker: s.speaker || options.speaker || 'Ryan',
        instruct: s.instruct || options.instruct || '',
      })),
      language: options.language || 'English',
      format: 'base64',
    }),
  });

  if (!response.ok) throw new Error(`Batch TTS failed: ${await response.text()}`);
  
  const data = await response.json();
  const paths = [];
  
  for (let i = 0; i < data.results.length; i++) {
    const result = data.results[i];
    if (result.success) {
      const path = resolve(outputDir, `scene_${i}.wav`);
      writeFileSync(path, Buffer.from(result.audio_base64, 'base64'));
      paths.push(path);
      console.log(`  Scene ${i}: ${result.duration?.toFixed(1)}s → ${path}`);
    } else {
      console.error(`  Scene ${i}: FAILED — ${result.error}`);
      paths.push(null);
    }
  }
  
  return paths;
}

async function main() {
  console.log(`🎙️ TTS Engine: ${engine}`);

  // Batch mode: process scenes file
  if (scenesFile) {
    const scenes = JSON.parse(readFileSync(scenesFile, 'utf-8'));
    if (!existsSync(outputDir)) mkdirSync(outputDir, {recursive: true});
    
    console.log(`Processing ${scenes.length} scenes...`);
    
    if (engine === 'qwen3') {
      await qwen3BatchTTS(scenes, outputDir, {speaker, instruct});
    } else {
      for (let i = 0; i < scenes.length; i++) {
        const s = scenes[i];
        const outPath = resolve(outputDir, `scene_${i}.mp3`);
        await edgeTTS(s.narration || s.text, outPath, voice);
        console.log(`  Scene ${i}: → ${outPath}`);
      }
    }
    console.log(`\n✅ All scenes generated in ${outputDir}`);
    return;
  }

  // Single text mode
  if (!text) {
    console.error('Usage: node tts.mjs --engine edge|qwen3 --text "Hello" --output audio.wav');
    process.exit(1);
  }

  if (engine === 'qwen3') {
    await qwen3TTS(text, output, {speaker, instruct});
  } else {
    await edgeTTS(text, output, voice);
  }
  
  console.log(`✅ Output: ${output}`);
}

main().catch(e => {
  console.error('❌', e.message);
  process.exit(1);
});
