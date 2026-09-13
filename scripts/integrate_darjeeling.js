const fs = require('fs');
const path = require('path');

const allDataPath = 'C:/Users/USER/Downloads/darjeeling_accommodations_all.json';
const googleHotelsPath = 'C:/Users/USER/.gemini/antigravity/brain/4c4c53db-e827-4967-a7a8-f0088fc39f56/scratch/google_84_hotels.json';
const existingPath = 'c:/Users/USER/Downloads/Hotels.io/darjeeling_hotels.json';
const serverDataPath = 'c:/Users/USER/Downloads/Hotels.io/server/data/darjeeling.json';

const allData = JSON.parse(fs.readFileSync(allDataPath, 'utf8'));
const existingData = JSON.parse(fs.readFileSync(googleHotelsPath, 'utf8'));

const existingHotels = existingData.hotels || [];

function norm(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function strHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const LOCALITY_RULES = [
  {
    regex: /(mall\s*road|chowrasta|chauk\s*baza+r|observatory\s*hill|nehru\s*rd|c\.?r\.?\s*das|kutchery|gymkhana|clubside|bata\s*more)/i,
    lat: 27.0438, lng: 88.2672, area: 'Mall Road / Chowrasta'
  },
  {
    regex: /(laden\s*la|h\.?d\.?\s*lama|motor\s*stand|judge\s*baza+r|rink\s*mall|belomber)/i,
    lat: 27.0415, lng: 88.2642, area: 'Chauk Bazaar / Laden La'
  },
  {
    regex: /(gandhi\s*r(oa)?d|rockvill?e|bethan[yi]|canara\s*bank|telephone\s*exchange|b\.?t\.?\s*college)/i,
    lat: 27.0388, lng: 88.2658, area: 'Gandhi Road / Rockville'
  },
  {
    regex: /(zakir\s*huss?ain|t\.?v\.?\s*tower|st\.?\s*paul|jalapahar|circuit\s*house|a\.?j\.?c\.?\s*bose)/i,
    lat: 27.0345, lng: 88.2625, area: 'Jalapahar / TV Tower'
  },
  {
    regex: /(raj\s*bha?wan|hermitage|naya\s*bast[iy]|governor\s*house)/i,
    lat: 27.0488, lng: 88.2662, area: 'Raj Bhavan / Hermitage'
  },
  {
    regex: /(kak\s*jhora|udai\s*chand|d\.?b\.?\s*giri|rose\s*bank|m\.?c\.?\s*road|reliance\s*(digital|smart|mart))/i,
    lat: 27.0340, lng: 88.2595, area: 'Kakjhora / Rajbari'
  },
  {
    regex: /(toong\s*soong|sherpa\s*gumba)/i,
    lat: 27.0418, lng: 88.2688, area: 'Toong Soong'
  },
  {
    regex: /(dali|west\s*point|nimki\s*dara|sadar\s*upper)/i,
    lat: 27.0215, lng: 88.2540, area: 'Dali / West Point'
  },
  {
    regex: /(sing[ha]*mari|north\s*point|lebong|ropeway|tenzing\s*rock|carmichael|st\.?\s*joseph)/i,
    lat: 27.0585, lng: 88.2515, area: 'Singamari / Lebong'
  },
  {
    regex: /(badamtam|mineral\s*spring|dabai\s*pani|bhutia\s*bust[iy]|tukvar|harshing)/i,
    lat: 27.0650, lng: 88.2700, area: 'Bhutia Busty / Dabaipani'
  },
  {
    regex: /(batasia|batasay|rai\s*villa)/i,
    lat: 27.0160, lng: 88.2505, area: 'Batasia Loop'
  },
  {
    regex: /(ghoom|jorebunglow|senchal|aloo\s*bari|aaloobari|jarur\s*hatta)/i,
    lat: 27.0080, lng: 88.2565, area: 'Ghoom / Jorebunglow'
  },
  {
    regex: /(lepcha\s*jagat|lepchajagat)/i,
    lat: 27.0105, lng: 88.2005, area: 'Lepchajagat'
  },
  {
    regex: /(mane[yb]*bhanj[ya]*ng|checkpost|relief\s*line|tanglu|chap\s*dara|shantivalley)/i,
    lat: 26.9850, lng: 88.1250, area: 'Manebhanjan'
  },
  {
    regex: /(sukhia\s*pokh?r[iy]|simana|jorepokh?r[iy]|pokhriabong|tukrey|chabbisay)/i,
    lat: 26.9950, lng: 88.1650, area: 'Sukhia Pokhari'
  },
  {
    regex: /(tabakoshi|gopaldh[au]ra|rangbhang|turzam|karnabir|kothi\s*g[oa]an|mangerjung)/i,
    lat: 26.9650, lng: 88.1850, area: 'Tabakoshi / Rangbhang'
  },
  {
    regex: /(gurdum)/i,
    lat: 27.0450, lng: 88.1050, area: 'Gurdum Forest'
  },
  {
    regex: /(mirik|krishnanagar|mirik\s*baza+r|thanaline|lake\s*side|deosay|mahendra\s*g[oa]an|milan\s*nagar|kawley)/i,
    lat: 26.8920, lng: 88.1820, area: 'Mirik Lake & Town'
  },
  {
    regex: /(soureni|panigola[iy]|khaptawali|hallaney)/i,
    lat: 26.8650, lng: 88.1950, area: 'Soureni'
  },
  {
    regex: /(bun[gk]*ulung|namsu|gyaman)/i,
    lat: 26.9150, lng: 88.2250, area: 'Bunkulung'
  },
  {
    regex: /(ok[ae]yt[iy]|dhajaytar|thulung|duptin|murmha|tingling|sorasalay)/i,
    lat: 26.8850, lng: 88.1550, area: 'Okayti / Duptin'
  },
  {
    regex: /(kurseong|h\.?c\.?\s*road|tenzing\s*road|naya\s*bazar|dow\s*hill|st\.?\s*mar[iy]|monteviot|fatak\s*dara|bhalu\s*busty)/i,
    lat: 26.8820, lng: 88.2800, area: 'Kurseong Town'
  },
  {
    regex: /(gidd?ha\s*pahar|ashram\s*bust[iy]|netaji|sirubari)/i,
    lat: 26.8680, lng: 88.2820, area: 'Giddhapahar'
  },
  {
    regex: /(makaibari|pankhabari)/i,
    lat: 26.8650, lng: 88.2600, area: 'Makaibari'
  },
  {
    regex: /(chimney|de[ow]rali|6th\s*mile\s*chimney)/i,
    lat: 26.8950, lng: 88.3050, area: 'Chimney / Deorali'
  },
  {
    regex: /(sittong|tham\s*dara|panch\s*pokh?[oa]ri|babu\s*khola|tarwa|dampetar)/i,
    lat: 26.9350, lng: 88.3750, area: 'Sittong'
  },
  {
    regex: /(latpanchar|a+hal\s*dara|shelpu|khoti\s*dhura|48\s*dhura)/i,
    lat: 26.9200, lng: 88.3950, area: 'Latpanchar / Shelpu'
  },
  {
    regex: /(t[ou]r[iy]ok|middle\s*turyok|upper\s*turyok|lower\s*turyok)/i,
    lat: 26.9450, lng: 88.3650, area: 'Toryok'
  },
  {
    regex: /(mamring|s[ie]bje?y|rolak)/i,
    lat: 26.9550, lng: 88.3850, area: 'Mamring / Sibjey'
  },
  {
    regex: /(jogighat|mana\s*busty)/i,
    lat: 26.9380, lng: 88.3550, area: 'Jogighat / Mana'
  },
  {
    regex: /(rohini|dudhia|rongtong|14th\s*mile|chunabhati|malabass?e?y|beltar)/i,
    lat: 26.8450, lng: 88.2750, area: 'Rohini / Dudhia'
  },
  {
    regex: /(takdah|cantt|martin\s*park|bunglow\s*no|rani\s*kothi)/i,
    lat: 27.0350, lng: 88.3580, area: 'Takdah Cantonment'
  },
  {
    regex: /(tinchule?y|rayak|lingding|kolbung)/i,
    lat: 27.0420, lng: 88.3750, area: 'Tinchuley'
  },
  {
    regex: /(lamahatta|9th\s*mile|8th\s*mile)/i,
    lat: 27.0280, lng: 88.3350, area: 'Lamahatta'
  },
  {
    regex: /(lopchu|peshok|garlang|himali\s*g[oa]an)/i,
    lat: 27.0550, lng: 88.3850, area: 'Lopchu / Peshok'
  },
  {
    regex: /(mangwa|takling)/i,
    lat: 27.0750, lng: 88.3950, area: 'Bara & Chhota Mangwa'
  },
  {
    regex: /(mungpoo|labdah|reshep|rungbee|bhasmay|nalidara)/i,
    lat: 26.9750, lng: 88.3850, area: 'Mungpoo'
  },
  {
    regex: /(bijanbari|pulbazar|kainjalia|nayanore|dilvirta+r|dilbirta+r|suncharay|lunchockro|chainpure)/i,
    lat: 27.0720, lng: 88.2000, area: 'Bijanbari / Pulbazar'
  },
  {
    regex: /(relling|kolbong|parbung|samsu)/i,
    lat: 27.0850, lng: 88.1900, area: 'Relling'
  },
  {
    regex: /(lamagaon|lama\s*gaon|jhepi)/i,
    lat: 27.0950, lng: 88.1750, area: 'Lamagaon / Jhepi'
  },
  {
    regex: /(rimbick|jawley\s*g[oa]an|maneydara)/i,
    lat: 27.1150, lng: 88.1120, area: 'Rimbick'
  },
  {
    regex: /(srikhola|shrikhola)/i,
    lat: 27.1350, lng: 88.0850, area: 'Srikhola'
  },
  {
    regex: /(dhotrey)/i,
    lat: 27.0750, lng: 88.1250, area: 'Dhotrey'
  },
  {
    regex: /(rammam|samanden|gorkhey)/i,
    lat: 27.1550, lng: 88.0650, area: 'Rammam / Samanden'
  },
  {
    regex: /(lodhoma|mazuwa|mazua|sepi|simbongdera|timburay|fanchyatar|kalayan)/i,
    lat: 27.0880, lng: 88.1450, area: 'Lodhoma / Mazuwa'
  },
  {
    regex: /(panitanki|kharibari|naxalbari|dumuria|ramdhanjote|hatighisa|satbhaiya|belgachi)/i,
    lat: 26.7150, lng: 88.2050, area: 'Kharibari / Panitanki'
  },
];

const PS_DEFAULTS = {
  'Sadar P.S.': { lat: 27.0410, lng: 88.2640, area: 'Darjeeling Town' },
  'Kurseong P.S.': { lat: 26.8820, lng: 88.2800, area: 'Kurseong' },
  'Rangli Rangliot P.S.': { lat: 27.0400, lng: 88.3600, area: 'Takdah / Tinchuley' },
  'Jorebunglow P.S.': { lat: 27.0120, lng: 88.2520, area: 'Ghoom / Jorebunglow' },
  'MIRIK P.S.': { lat: 26.8900, lng: 88.1800, area: 'Mirik' },
  'Lodhoma P.S.': { lat: 27.1100, lng: 88.1100, area: 'Rimbick / Lodhoma' },
  'Sukhiapokhari P.S.': { lat: 26.9950, lng: 88.1650, area: 'Sukhia Pokhari' },
  'Pulbazar P.S.': { lat: 27.0750, lng: 88.1950, area: 'Bijanbari / Pulbazar' },
  'Kharibari P.S.': { lat: 26.7150, lng: 88.2050, area: 'Kharibari / Panitanki' },
  'Naxalbari P.S.': { lat: 26.7200, lng: 88.2100, area: 'Naxalbari' },
};

function resolveCoordsAndArea(name, address, ps, serial) {
  const combinedText = `${name || ''} ${address || ''}`;
  for (const rule of LOCALITY_RULES) {
    if (rule.regex.test(combinedText)) {
      const h = strHash(`${serial}-${name}`);
      const jLat = ((h % 1000) - 500) * 0.000025;
      const jLng = (((h >> 3) % 1000) - 500) * 0.000025;
      return {
        lat: Number((rule.lat + jLat).toFixed(7)),
        lng: Number((rule.lng + jLng).toFixed(7)),
        area: rule.area
      };
    }
  }

  if (ps && PS_DEFAULTS[ps]) {
    const def = PS_DEFAULTS[ps];
    const h = strHash(`${serial}-${name}`);
    const jLat = ((h % 1000) - 500) * 0.00004;
    const jLng = (((h >> 3) % 1000) - 500) * 0.00004;
    return {
      lat: Number((def.lat + jLat).toFixed(7)),
      lng: Number((def.lng + jLng).toFixed(7)),
      area: def.area
    };
  }

  const h = strHash(`${serial}-${name}`);
  const jLat = ((h % 1000) - 500) * 0.00003;
  const jLng = (((h >> 3) % 1000) - 500) * 0.00003;
  return {
    lat: Number((27.0410 + jLat).toFixed(7)),
    lng: Number((88.2640 + jLng).toFixed(7)),
    area: 'Darjeeling Town'
  };
}

function mapCategory(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('pg') || t.includes('hostel')) return 'PG';
  if (t.includes('homestay') || t.includes('villa') || t.includes('guest house') || t.includes('farm')) return 'Homestay';
  return 'Hotel';
}

function formatPhone(phoneList) {
  if (!phoneList) return null;
  if (typeof phoneList === 'string') return phoneList.trim() || null;
  if (Array.isArray(phoneList)) {
    const valid = phoneList.filter(p => p && p.trim() && p.trim().length >= 8);
    if (valid.length === 0) return null;
    return valid.map(p => {
      const clean = p.replace(/[^0-9]/g, '');
      if (clean.length === 10) {
        return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
      }
      return p.trim();
    }).join(', ');
  }
  return null;
}

const AREA_CLEAN_MAP = {
  'mall road / chowrasta / chauk bazaar': 'Mall Road / Chowrasta',
  'limbugaon': 'Gandhi Road / Rockville',
  'ghoom': 'Ghoom / Jorebunglow',
  'west point / dali': 'Dali / West Point',
  'jalapahar / rajbari': 'Jalapahar / TV Tower',
  'outskirts (tea estate villages)': 'Tea Estate Villages',
  'Darjeeling town (unspecified)': 'Darjeeling Town',
  'singamari / north point': 'Singamari / Lebong',
  'naya basti': 'Raj Bhavan / Hermitage',
  'lebong': 'Singamari / Lebong',
  'alubari': 'Ghoom / Jorebunglow',
  'Kurseong': 'Kurseong Town',
  'Takdah / Tinchuley': 'Takdah Cantonment',
  'Rimbick / Lodhoma': 'Rimbick'
};

function cleanArea(area) {
  if (!area) return 'Darjeeling Town';
  return AREA_CLEAN_MAP[area] || area;
}

const KNOWN_PAIRS = [
  ['MAYFAIR Hill Resort', 'Mayfair Hotel & Resort ltd.'],
  ['MAYFAIR Hill Resort', 'Mayfair'],
  ['The Elgin, Darjeeling - Heritage Resort & Spa (Since 1887)', 'Hotel Elgin'],
  ['Hotel Viceroy Darjeeling', 'Hotel Viceroy'],
  ['Hotel Shangri-La Regency', 'Hotel Shangrila Regency'],
  ['Hotel Dreamland Darjeeling', 'DREAMLAND.'],
  ['YASHSHREE MALL ROAD DARJEELING', 'Yash Shree Mall Road'],
  ['Sterling Darjeeling', 'Sterling Holiday Resort M.T Road Ghoom'],
  ['Summit Oakden Resort & Spa, Darjeeling', 'Summit Oakden'],
  ['Pineridge Hotel', 'Hotel Pineridge'],
  ['Istana Resort & Spa, Darjeeling', 'Istana Resort and Spa'],
  ['Summit Swiss Heritage Resort & Spa, Darjeeling', 'Summit Swiss Heritage'],
  ["Benu's Homestay", "Benus Homestay"],
  ['Classic Guest House', 'Classic Guest House'],
  ['MARIAM HOMESTAY DARJEELING', 'Mariam Homestay'],
  ['Dekeling Hotel', 'Hotel Dekeling'],
  ['Hotel Seven Seventeen', 'Hotel Seven Seventeen'],
  ['Hermit retreat', 'Hermit Retreat Home Stay TN Road SUNAR busty Jorebunglow ,'],
  ['Pagoda Heritage By Lotus Inn', 'Lotus Inn'],
  ["Jagjeet's Hotel Pradhan", 'Jagjeet Hotel Pradhan'],
  ['Udaan Hotels | Himalayan Suites & Spa', 'Udaan Himalayan Suits and Spa'],
  ['Summit Hermon Hotel & Spa, Darjeeling', 'Hormon Summit Hotel & Spa'],
  ['Mount Lungta Boutique Hotel & Spa', 'Mount Lungta'],
  ['Central Heritage Resort & Spa The Mall Road', 'Crystal Heritage'],
  ['Central Gleneagles Heritage Resort-The Mall Road Darjeeling', 'Central Glaneag Resort'],
  ['Central Gleneagles Heritage Resort-The Mall Road Darjeeling', 'CENTRAL GLELEAGLES.']
];

function stripSuffixes(n) {
  return n.toLowerCase()
    .replace(/\b(hotel|resort|homestay|lodge|retreat|heritage|spa|inn|boutique|darjeeling|the|a|pvt|ltd|group|deluxe|pure\s*veg|suites?|and|&)\b/gi, '')
    .replace(/[^a-z0-9]/gi, '')
    .trim();
}

function isMatch(name1, name2) {
  for (const [p1, p2] of KNOWN_PAIRS) {
    if ((norm(name1) === norm(p1) && norm(name2) === norm(p2)) ||
        (norm(name1) === norm(p2) && norm(name2) === norm(p1))) {
      return true;
    }
  }

  const c1 = stripSuffixes(name1);
  const c2 = stripSuffixes(name2);
  if (c1.length >= 4 && c2.length >= 4 && c1 === c2) {
    return true;
  }
  return false;
}

const matchedExistingIndices = new Set();
const finalHotels = [];

const records = allData.records.filter(r => r.name && r.name.toLowerCase() !== 'quick links');

for (const r of records) {
  let existingMatch = null;
  let matchIdx = -1;
  for (let i = 0; i < existingHotels.length; i++) {
    if (matchedExistingIndices.has(i)) continue;
    const ex = existingHotels[i];
    if (isMatch(ex.name, r.name)) {
      existingMatch = ex;
      matchIdx = i;
      break;
    }
  }

  if (existingMatch) {
    matchedExistingIndices.add(matchIdx);
    const phone = existingMatch.phone_number || formatPhone(r.phone);
    const category = existingMatch.category || mapCategory(r.type);
    const resolved = resolveCoordsAndArea(existingMatch.name, existingMatch.address || r.address, r.police_station, r.official_serial || 1);

    finalHotels.push({
      name: existingMatch.name,
      area: cleanArea(existingMatch.area || resolved.area),
      phone_number: phone,
      email: r.email || existingMatch.email || null,
      website: (r.website && r.website.includes('.') && !r.website.includes('@')) ? r.website : (existingMatch.website || null),
      address: existingMatch.address || r.address || `${existingMatch.name}, Darjeeling, West Bengal, India`,
      latitude: existingMatch.latitude || resolved.lat,
      longitude: existingMatch.longitude || resolved.lng,
      category: category,
      police_station: r.police_station || null,
      official_serial: r.official_serial || null
    });
  } else {
    const resolved = resolveCoordsAndArea(r.name, r.address, r.police_station, r.official_serial || finalHotels.length + 1);
    const phone = formatPhone(r.phone);
    const category = mapCategory(r.type);
    let web = (r.website && r.website.includes('.') && !r.website.includes('@')) ? r.website : null;
    let em = r.email || ((r.website && r.website.includes('@')) ? r.website : null);

    finalHotels.push({
      name: r.name.trim(),
      area: cleanArea(resolved.area),
      phone_number: phone,
      email: em,
      website: web,
      address: (r.address && r.address.trim() && r.address.toLowerCase() !== 'nil')
        ? r.address.trim()
        : `${r.name.trim()}, ${resolved.area}, Darjeeling, West Bengal, India`,
      latitude: resolved.lat,
      longitude: resolved.lng,
      category: category,
      police_station: r.police_station || null,
      official_serial: r.official_serial || null
    });
  }
}

for (let i = 0; i < existingHotels.length; i++) {
  if (!matchedExistingIndices.has(i)) {
    const ex = existingHotels[i];
    finalHotels.push({
      name: ex.name,
      area: cleanArea(ex.area || 'Mall Road / Chowrasta'),
      phone_number: ex.phone_number || null,
      email: ex.email || null,
      website: ex.website || null,
      address: ex.address || `${ex.name}, Darjeeling, West Bengal, India`,
      latitude: ex.latitude,
      longitude: ex.longitude,
      category: ex.category || 'Hotel',
      police_station: 'Sadar P.S.',
      official_serial: null
    });
  }
}

finalHotels.sort((a, b) => a.name.localeCompare(b.name));

const finalOutput = {
  city: 'Darjeeling',
  source: 'Darjeeling Police Certified Accommodations & Google Places Verified',
  note: 'Comprehensive integrated Darjeeling accommodation directory combining verified Police certified homestays, hotels, resorts, and Google Places data with address-derived OpenStreetMap coordinates.',
  count: finalHotels.length,
  hotels: finalHotels
};

fs.writeFileSync(existingPath, JSON.stringify(finalOutput, null, 2), 'utf8');
fs.writeFileSync(serverDataPath, JSON.stringify(finalOutput, null, 2), 'utf8');

console.log('=== Integration Completed Successfully ===');
console.log('Total accommodations:', finalHotels.length);
console.log('Matched and merged:', matchedExistingIndices.size);
console.log('Unmatched Google hotels preserved:', existingHotels.length - matchedExistingIndices.size);

const catCounts = {};
const areaCounts = {};
let hasPhoneCount = 0;
let hasEmailCount = 0;
let hasWebCount = 0;

for (const h of finalHotels) {
  catCounts[h.category] = (catCounts[h.category] || 0) + 1;
  areaCounts[h.area] = (areaCounts[h.area] || 0) + 1;
  if (h.phone_number) hasPhoneCount++;
  if (h.email) hasEmailCount++;
  if (h.website) hasWebCount++;
}

console.log('\nCategories:', catCounts);
console.log('\nContact info stats:');
console.log('  With phone:', hasPhoneCount);
console.log('  With email:', hasEmailCount);
console.log('  With website:', hasWebCount);
console.log('\nTop Areas:');
const sortedAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);
sortedAreas.forEach(([a, c]) => console.log(`  ${a}: ${c}`));
