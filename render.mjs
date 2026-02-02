/**
 * Social Video Engine — CLI Render Script
 * 
 * Usage:
 *   node render.mjs                           # Render default demo video
 *   node render.mjs --config scenes.json      # Render from JSON config
 *   node render.mjs --theme sunset            # Use different theme
 *   node render.mjs --output /tmp/video.mp4   # Custom output path
 *   node render.mjs --composition StatCardPreview  # Render specific composition
 */

import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {readFileSync, existsSync} from 'fs';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse CLI args
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : null;
}

const configFile = getArg('config');
const themeName = getArg('theme') || 'midnight';
const outputPath = getArg('output') || resolve(__dirname, 'out', 'video.mp4');
const compositionId = getArg('composition') || 'SocialVideo';
const codec = getArg('codec') || 'h264';

async function main() {
  console.log('🎬 Social Video Engine');
  console.log(`   Theme: ${themeName}`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Composition: ${compositionId}`);
  
  // Load custom config if provided
  let inputProps = undefined;
  if (configFile && existsSync(configFile)) {
    console.log(`   Config: ${configFile}`);
    const config = JSON.parse(readFileSync(configFile, 'utf-8'));
    inputProps = config;
  }

  // Bundle the project
  console.log('\n📦 Bundling...');
  const bundled = await bundle({
    entryPoint: resolve(__dirname, 'src/index.ts'),
    webpackOverride: (config) => config,
  });

  // Select composition
  const composition = await selectComposition({
    serveUrl: bundled,
    id: compositionId,
    inputProps: inputProps || {},
  });

  // Override duration if custom scenes provided
  if (inputProps?.scenes) {
    const totalFrames = inputProps.scenes.reduce((sum, s) => sum + s.duration, 0);
    composition.durationInFrames = totalFrames;
  }

  console.log(`\n🎥 Rendering ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(1)}s)...`);

  // Render
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec,
    outputLocation: outputPath,
    inputProps: inputProps || {},
    chromiumOptions: {
      args: ['--no-sandbox', '--disable-gpu', '--single-process'],
    },
    onProgress: ({progress}) => {
      if (Math.round(progress * 100) % 10 === 0) {
        process.stdout.write(`\r   Progress: ${Math.round(progress * 100)}%`);
      }
    },
  });

  console.log(`\n\n✅ Video rendered: ${outputPath}`);
}

main().catch((err) => {
  console.error('❌ Render failed:', err.message);
  process.exit(1);
});
