/**
 * fetch_brand_design.js
 * Helper tool to search and fetch brand design references from xjli360/awesome-design-md-ecommerce
 * 
 * Usage:
 *   node fetch_brand_design.js get <brand-slug> [measured|design]
 *   node fetch_brand_design.js search <category-or-brand>
 */

const fs = require('fs');
const path = require('path');

const REPO_RAW = 'https://raw.githubusercontent.com/xjli360/awesome-design-md-ecommerce/main';

async function fetchFile(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (HTTP ${res.status})`);
  }
  return await res.text();
}

async function getBrandDesign(brandSlug, type = 'design') {
  const fileName = type === 'measured' ? 'MEASURED.md' : 'DESIGN.md';
  const url = `${REPO_RAW}/design-md/${brandSlug}/${fileName}`;
  console.log(`Fetching ${url}...`);
  try {
    const text = await fetchFile(url);
    const outPath = path.join(process.cwd(), `${brandSlug}_${fileName}`);
    fs.writeFileSync(outPath, text, 'utf8');
    console.log(`Saved to ${outPath} (${text.length} bytes)`);
    return text;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // If measured failed, fallback to DESIGN.md
    if (type === 'measured') {
      console.log('Falling back to DESIGN.md...');
      return getBrandDesign(brandSlug, 'design');
    }
  }
}

async function searchBrands(query) {
  console.log(`Searching brands matching "${query}" in INDEX.md...`);
  const indexUrl = `${REPO_RAW}/INDEX.md`;
  const text = await fetchFile(indexUrl);
  const lines = text.split('\n');
  const matches = lines.filter(l => new RegExp(query, 'i').test(l)).slice(0, 20);
  console.log(`Found ${matches.length} matches:`);
  matches.forEach(m => console.log(' - ' + m.trim()));
}

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'get') {
  const brand = args[1];
  const type = args[2] || 'design';
  if (!brand) {
    console.error('Please specify brand slug. Example: node fetch_brand_design.js get rouje');
    process.exit(1);
  }
  getBrandDesign(brand, type);
} else if (command === 'search') {
  const q = args[1];
  if (!q) {
    console.error('Please specify search query. Example: node fetch_brand_design.js search fashion');
    process.exit(1);
  }
  searchBrands(q);
} else {
  console.log('Commands:');
  console.log('  node fetch_brand_design.js get <brand-slug> [measured|design]');
  console.log('  node fetch_brand_design.js search <keyword>');
}
