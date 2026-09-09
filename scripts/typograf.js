#!/usr/bin/env node

const Typograf = require('typograf');
const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);

if (!files.length) {
  console.log('Использование: node scripts/typograf.js <файл1.html> [файл2.html ...]');
  process.exit(0);
}

const tp = new Typograf({ locale: ['ru', 'en-US'] });

tp.disableRule('common/html/escape');
tp.disableRule('common/html/nbr');
tp.disableRule('common/html/stripTags');
tp.disableRule('common/html/url');

for (const file of files) {
  const filePath = path.resolve(file);

  if (!fs.existsSync(filePath)) {
    console.error(`Файл не найден: ${file}`);
    continue;
  }

  const text = fs.readFileSync(filePath, 'utf-8');
  const result = tp.execute(text);

  fs.writeFileSync(filePath, result);
  console.log(`✓ ${file}`);
}
