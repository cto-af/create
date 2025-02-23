#!/usr/bin/env node
/* eslint-disable no-console */

import {$} from 'execa';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {Scaffold as scaffold} from 'simple-scaffold';

const cwd = process.cwd();
const base = path.basename(cwd);
const parent = path.basename(path.dirname(cwd));
const args = process.argv.slice(2);

const org = parent.startsWith('@') ? parent : '';
const name = org ? `${parent}/${base}` : base;
const {stdout: ujson} = await $`gh api https://api.github.com/user`;
const {
  name: author,
  email,
  ...user
} = JSON.parse(ujson);

const login = org ? org.slice(1).replaceAll('.', '-') : user.login;
const templates = [fileURLToPath(new URL('./template', import.meta.url))];

await scaffold({
  base,
  name,
  templates,
  data: {
    author,
    base,
    email,
    login,
    user: user.login,
    gitignore: '.gitignore',
    gitattributes: '.gitattributes',
  },
});

if (!args.includes('--noexec')) {
  const v = {verbose: 'full'};
  await $(v)`ncu -u`;
  await $(v)`pnpm install`;
  await $(v)`npm run build`;
  if (!args.includes('--nogit')) {
    await $(v)`git init .`;
    await $(v)`git add .`;
    await $(v)`git ci -m ${'Initial checkin'}`;
    console.log('---------\nNEXT STEPS\n---------');
    console.log(`gh repo create ${login}/${base} --public --source=. --remote=upstream --push`);
    console.log('gh secret set NPM_TOKEN');
    console.log('gh secret set CODECOV_TOKEN');
  }
}
