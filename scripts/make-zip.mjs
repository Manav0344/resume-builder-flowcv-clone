import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
const name = 'resume-builder-flowcv-clone.zip';
if (existsSync(name)) rmSync(name);
execFileSync('zip', [
  '-r', name,
  'src', 'dist', 'scripts', 'package.json', 'package-lock.json', 'index.html', 'vite.config.js', 'tailwind.config.js', 'postcss.config.cjs', 'README.md', '.gitignore',
  '-x', 'node_modules/*', '.git/*', '.arena/*', '.npm/*', name,
], { stdio: 'inherit' });
console.log(`Created ${name}`);
