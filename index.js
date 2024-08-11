#!/usr/bin/env node
/* eslint-disable no-console */

import {$} from 'execa';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {Scaffold as scaffold} from 'simple-scaffold';

const cwd = process.cwd();
const base = path.basename(cwd);
const parent = path.basename(path.dirname(cwd));

const org = parent.startsWith('@') ? parent : '';
const name = org ? `${parent}/${base}` : base;
const {stdout: ujson} = await $`gh api https://api.github.com/user`;
const {
  name: author,
  email,
  ...user
} = JSON.parse(ujson);

const login = org ? org.slice(1).replaceAll('.', '_') : user.login;
const templates = [fileURLToPath(new URL('./template', import.meta.url))];

await scaffold({
  name,
  templates,
  data: {
    author,
    base,
    email,
    login,
    user: user.login,
    npmignore: '.npmignore',
    gitignore: '.gitignore',
    gitattributes: '.gitattributes',
  },
});

const v = {verbose: 'full'};
await $(v)`ncu -u`;
await $(v)`pnpm install`;
await $(v)`git init .`;
await $(v)`git add .`;
await $(v)`git ci -m ${'Initial checkin'}`;
await $(v)`npm run build`;
