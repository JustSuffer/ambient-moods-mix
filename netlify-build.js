import fs from 'fs';
import { execSync } from 'child_process';

console.log('Installing @netlify/vite-plugin-tanstack-start...');
execSync('npm install -D @netlify/vite-plugin-tanstack-start', { stdio: 'inherit' });

console.log('Modifying vite.config.ts for Netlify...');
const configPath = './vite.config.ts';
let config = fs.readFileSync(configPath, 'utf8');

if (!config.includes('@netlify/vite-plugin-tanstack-start')) {
  config = config.replace(
    'import { defineConfig } from "@lovable.dev/vite-tanstack-config";',
    'import { defineConfig } from "@lovable.dev/vite-tanstack-config";\nimport netlify from "@netlify/vite-plugin-tanstack-start";'
  );
  config = config.replace(
    'tanstackStart: {',
    'plugins: [netlify()],\n  tanstackStart: {'
  );
  fs.writeFileSync(configPath, config);
  console.log('vite.config.ts modified successfully.');
}

console.log('Running build...');
execSync('npm run build', { stdio: 'inherit' });
