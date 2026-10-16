import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';

const directory = resolve(process.argv[2] ?? 'dist');
const approvedEmails = new Set(['liuyang1520@gmail.com']);
const textExtensions = new Set(['.html', '.xml', '.svg', '.css', '.js', '.mjs', '.json', '.txt']);
const findings = [];
let checked = 0;

function report(file, reason) {
  // Report locations and rule names only; never echo potentially private values.
  findings.push(`${relative(directory, file)}: ${reason}`);
}

const patterns = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['service credential', /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,}|(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}|AKIA[A-Z0-9]{16}|AIza[A-Za-z0-9_-]{30,})\b/],
  ['local filesystem path', /\/(?:Users|home)\/[^\s<>"']+/],
  ['phone number', /(?<!\d)(?:\+?1[ .-]?)?\(?[2-9]\d{2}\)?[ .-][2-9]\d{2}[ .-]\d{4}(?!\d)/],
];

function checkPng(file, data) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!data.subarray(0, 8).equals(signature)) {
    report(file, 'invalid PNG');
    return;
  }
  for (let offset = 8; offset < data.length;) {
    if (offset + 12 > data.length) {
      report(file, 'invalid PNG chunk');
      return;
    }
    const length = data.readUInt32BE(offset);
    const type = data.toString('ascii', offset + 4, offset + 8);
    if (offset + 12 + length > data.length) {
      report(file, 'invalid PNG chunk length');
      return;
    }
    if (['eXIf', 'iTXt', 'tEXt', 'zTXt'].includes(type)) {
      report(file, 'embedded image metadata requires review');
    }
    offset += 12 + length;
  }
}

async function inspect(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = resolve(folder, entry.name);
    if (entry.isSymbolicLink()) {
      report(file, 'public symlink could expose a local file');
      continue;
    }
    if (/(?:^\.env(?:\.|$)|^\.(?:git|aws|codex|agents|ssh|npmrc)$|^private$|^id_(?:rsa|ed25519)$)|\.(?:pdf|pem|key|p12|pfx|map|log|bak|zip|tgz)$/i.test(entry.name)) {
      report(file, 'private document, credential file, source map, or archive');
    }
    if (entry.isDirectory()) {
      await inspect(file);
      continue;
    }
    if (!entry.isFile()) continue;
    checked++;
    if (/^(?:author|portrait)\.(?:jpe?g|png|webp)$/i.test(entry.name)) {
      report(file, 'unapproved portrait asset');
    }
    const data = await readFile(file);
    const extension = extname(entry.name).toLowerCase();
    if (extension === '.png') checkPng(file, data);
    if (!textExtensions.has(extension)) continue;
    const content = data.toString('utf8');
    for (const [label, pattern] of patterns) {
      if (pattern.test(content)) report(file, label);
    }
    for (const match of content.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
      if (!approvedEmails.has(match[0].toLowerCase())) report(file, 'unapproved email address');
    }
    for (const match of content.matchAll(/mailto:([^"'<>\s]*)/gi)) {
      try {
        const target = match[1].replaceAll('&amp;', '&');
        const [recipients, query = ''] = target.split('?');
        const parameters = new URLSearchParams(query);
        const addresses = [decodeURIComponent(recipients), ...['to', 'cc', 'bcc'].flatMap(key => parameters.getAll(key))];
        if (addresses.flatMap(value => value.split(/[;,]/)).some(value => value.trim() && !approvedEmails.has(value.trim().toLowerCase()))) {
          report(file, 'unapproved mailto recipient');
        }
      } catch {
        report(file, 'malformed email hyperlink');
      }
    }
  }
}

await inspect(directory);
if (findings.length) {
  console.error(`Privacy check failed for ${relative(process.cwd(), directory)}:\n${findings.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Privacy check passed: ${checked} files in ${relative(process.cwd(), directory)}.`);
}
