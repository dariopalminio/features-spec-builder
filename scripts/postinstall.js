'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const fse = require('fs-extra');

const SOURCE_DIR = path.join(__dirname, '..', '.claude');

function resolveDestDir() {
  if (process.env.npm_config_global === 'true') {
    return { destDir: path.join(os.homedir(), '.claude'), mode: 'global' };
  }
  return { destDir: path.join(process.cwd(), '.claude'), mode: 'local' };
}

function validateDestBase(destDir) {
  if (fs.existsSync(destDir) && !fs.statSync(destDir).isDirectory()) {
    console.error(`SDDF error: .claude exists but is not a directory`);
    process.exit(1);
  }
}

async function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return { installed: 0, skipped: 0 };

  await fse.ensureDir(destDir);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  let installed = 0;
  let skipped = 0;

  for (const entry of entries) {
    const srcEntry = path.join(srcDir, entry.name);
    const destEntry = path.join(destDir, entry.name);

    if (fs.existsSync(destEntry)) {
      console.log(`  Skipped (already exists): ${destEntry}`);
      skipped++;
    } else {
      await fse.copy(srcEntry, destEntry);
      console.log(`  Installed: ${destEntry}`);
      installed++;
    }
  }

  return { installed, skipped };
}

async function main() {
  const { destDir, mode } = resolveDestDir();

  console.log(`\nSDDF postinstall: copying skills and agents to ${destDir}\n`);

  validateDestBase(destDir);

  const skillsSrc = path.join(SOURCE_DIR, 'skills');
  const skillsDest = path.join(destDir, 'skills');
  const { installed: si, skipped: ss } = await copyDir(skillsSrc, skillsDest);

  const agentsSrc = path.join(SOURCE_DIR, 'agents');
  const agentsDest = path.join(destDir, 'agents');
  const { installed: ai, skipped: as_ } = await copyDir(agentsSrc, agentsDest);

  console.log(`\nSDDF installed (${mode}): ${si} skills, ${ai} agents (${ss + as_} skipped)\n`);
}

main().catch((err) => {
  console.error('SDDF postinstall failed:', err.message);
  process.exit(1);
});
