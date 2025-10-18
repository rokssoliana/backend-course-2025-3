#!/usr/bin/env node

const fs = require('fs');
const { program } = require('commander');

program
  .requiredOption('-i, --input <path>', 'path to input JSON file')
  .option('-o, --output <path>', 'path to output file')
  .option('-d, --display', 'display result to console')
  .option('-f, --furnished', 'show only houses with furnishingstatus = "furnished"')
  .option('-p, --price <number>', 'show only houses with price less than given value', Number);

program.parse(process.argv);
const opts = program.opts();

if (!opts.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(opts.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

let raw;
try {
  raw = fs.readFileSync(opts.input, 'utf8');
} catch (err) {
  console.error('Cannot find input file');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error('Input file is not valid JSON');
  process.exit(1);
}

if (!Array.isArray(data)) data = [data];

let result = data.filter(item => {
  if (item.price === undefined || item.area === undefined) return false;

  if (opts.furnished && String(item.furnishingstatus).toLowerCase() !== 'furnished') return false;

  if (opts.price && Number(item.price) >= opts.price) return false;

  return true;
});

const lines = result.map(it => `${it.price} ${it.area}`);

if (!opts.output && !opts.display) process.exit(0);

if (opts.output) {
  try {
    fs.writeFileSync(opts.output, lines.join('\n'), 'utf8');
  } catch {
    console.error('Cannot write to output file');
    process.exit(1);
  }
}

if (opts.display) {
  console.log(lines.join('\n'));
}
