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
import {execSync} from 'child_process';

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

// Find a working Chrome/Chromium binary
function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  
  for (const bin of candidates) {
    try {
      execSync(`${bin} --version 2>/dev/null`, {stdio: 'pipe'});
      return bin;
    } catch {}
  }
  return null;
}

async function main() {
  console.log('🎬 Social Video Engine');
  console.log(`   Theme: ${themeName}`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Composition: ${compositionId}`);
  
  // Ensure we have a browser
  let browserPath = findBrowser();
  if (!browserPath) {
    console.log('\n🌐 No Chrome found — downloading via Remotion...');
    try {
      execSync('npx remotion browser ensure', {stdio: 'inherit', cwd: __dirname});
    } catch {}
  } else {
    console.log(`   Browser: ${browserPath}`);
  }
  
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
  const renderOpts = {
    composition,
    serveUrl: bundled,
    codec,
    outputLocation: outputPath,
    inputProps: inputProps || {},
    chromiumOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
    },
    onProgress: ({progress}) => {
      if (Math.round(progress * 100) % 10 === 0) {
        process.stdout.write(`\r   Progress: ${Math.round(progress * 100)}%`);
      }
    },
  };

  // Use custom browser path if found (not snap)
  browserPath = findBrowser();
  if (browserPath) {
    renderOpts.browserExecutable = browserPath;
  }

  await renderMedia(renderOpts);

  console.log(`\n\n✅ Video rendered: ${outputPath}`);
}

main().catch((err) => {
  console.error('❌ Render failed:', err.message);
  process.exit(1);
});
