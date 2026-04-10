// Script to extract unique street names from HN.json dataset
// Source: https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/data/HN.json

const https = require('https');
const fs = require('fs');
const path = require('path');

const URL = 'https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/data/HN.json';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching HN.json from CDN...');
  const hn = await fetchJSON(URL);

  // 1. Extract all unique street names (excluding pure numbers and very short ones)
  const streetSet = new Set();
  const streetsByDistrict = {};

  for (const district of hn.district) {
    const distName = `${district.pre} ${district.name}`;
    const streets = district.street || [];
    streetsByDistrict[distName] = streets;

    for (const st of streets) {
      // Skip pure numbers (like "1", "32", "70") and very short entries
      if (/^\d+[A-Za-z]?$/.test(st) || st.length < 2) continue;
      // Skip generic route names (Quốc lộ, Tỉnh lộ, ĐT, etc.)
      if (/^(Quốc [Ll]ộ|Tỉnh [Ll]ộ|ĐT |Liên tỉnh|Số \d)/i.test(st)) continue;
      streetSet.add(st);
    }
  }

  const streetList = [...streetSet].sort((a, b) => a.localeCompare(b, 'vi'));

  console.log(`Total unique streets: ${streetList.length}`);

  // 2. Also extract district-ward mapping with prefixes
  const districtWardMap = {};
  for (const district of hn.district) {
    districtWardMap[district.name] = {
      pre: district.pre,
      wards: district.ward.map(w => ({ name: w.name, pre: w.pre })),
      streets: district.street || []
    };
  }

  // 3. Save street list as JSON array
  const outStreets = path.join(__dirname, '..', 'data', 'hanoi_streets.json');
  fs.writeFileSync(outStreets, JSON.stringify(streetList, null, 2), 'utf8');
  console.log(`Saved ${streetList.length} streets to ${outStreets}`);

  // 4. Save full district-ward-street mapping
  const outMap = path.join(__dirname, '..', 'data', 'hanoi_districts.json');
  fs.writeFileSync(outMap, JSON.stringify(districtWardMap, null, 2), 'utf8');
  console.log(`Saved district mapping to ${outMap}`);

  // 5. Print stats
  console.log('\n--- Stats ---');
  console.log(`Districts: ${hn.district.length}`);
  let totalWards = 0;
  for (const d of hn.district) totalWards += d.ward.length;
  console.log(`Wards: ${totalWards}`);
  console.log(`Unique Streets (filtered): ${streetList.length}`);

  // Print sample
  console.log('\nSample streets:');
  streetList.slice(0, 20).forEach(s => console.log(`  - ${s}`));
}

main().catch(console.error);
