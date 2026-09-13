const fs = require('fs');
const path = require('path');

const srcHotels = JSON.parse(fs.readFileSync('sikkim_hotels.json', 'utf8'));

function norm(s) {
  return (s || '').toLowerCase()
    .replace(/[.\-_,\/()']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const LOCALITIES = [
  // Gangtok Core
  { area: 'm.g. marg / mall', coords: [27.3298, 88.6136], aliases: ['mg marg', 'm g marg', 'new market', 'old market', 'lal market', 'star cinema', 'denzong cinema', 'b l house', 'sbs bank'] },
  { area: 'tibet road', coords: [27.3311, 88.6152], aliases: ['tibet road', 'tibet rd', 'sonam delek', 'press club'] },
  { area: 'kazi road', coords: [27.3282, 88.6125], aliases: ['kazi road', 'kazi rd'] },
  { area: 'deorali', coords: [27.3197, 88.6083], aliases: ['deorali', 'ropeway', 'cable car', 'namgyal institute', 'chorten'] },
  { area: 'upper sichey', coords: [27.3393, 88.6073], aliases: ['upper sichey', 'bhai school', 'tamang gumpa', 'sichey co operative'] },
  { area: 'lower sichey', coords: [27.3330, 88.6020], aliases: ['lower sichey', 'sichey link'] },
  { area: 'middle sichey', coords: [27.3360, 88.6050], aliases: ['middle sichey'] },
  { area: 'sichey', coords: [27.3350, 88.6050], aliases: ['sichey', 'court', 'high court', 'district court'] },
  { area: 'upper arithang', coords: [27.3280, 88.6115], aliases: ['upper arithang', 'gurudwara'] },
  { area: 'lower arithang', coords: [27.3250, 88.6105], aliases: ['lower arithang'] },
  { area: 'arithang', coords: [27.3265, 88.6110], aliases: ['arithang'] },
  { area: 'namnang', coords: [27.3245, 88.6105], aliases: ['namnang', 'nam nang'] },
  { area: 'pani house', coords: [27.3210, 88.6090], aliases: ['pani house', 'panihouse', 'snop', 's n o p'] },
  { area: 'bojoghari', coords: [27.3540, 88.6250], aliases: ['bojoghari', 'bhojogari', 'swastik'] },
  { area: 'balwakhani', coords: [27.3370, 88.6190], aliases: ['balwakhani', 'baluwakhani'] },
  { area: 'burtuk', coords: [27.3480, 88.6170], aliases: ['burtuk', 'lower burtuk', 'upper burtuk', 'helipad', 'burfuk'] },
  { area: 'tadong / 5th mile', coords: [27.3174, 88.5974], aliases: ['tadong', '5th mile', '6th mile', 'daragaon', 'sikkim university', 'sisa golai', 'nh31a', 'nh 31a', 'nh 10', 'nh10'] },
  { area: 'ranipool', coords: [27.2950, 88.5926], aliases: ['ranipool', 'rani pool'] },
  { area: 'chandmari', coords: [27.3395, 88.6185], aliases: ['chandmari', 'chanmari'] },
  { area: 'syari', coords: [27.3140, 88.6210], aliases: ['syari', 'upper syari', 'lower syari', 'royal plaza'] },
  { area: 'development area', coords: [27.3340, 88.6170], aliases: ['development area', 'dev area', 'zero point'] },
  { area: 'samdur', coords: [27.2980, 88.5930], aliases: ['samdur', 'lower samdur', 'upper samdur'] },
  { area: 'rumtek', coords: [27.3044, 88.5606], aliases: ['rumtek', 'sajong', 'sang'] },
  { area: 'martam', coords: [27.2600, 88.5400], aliases: ['martam', 'upper martam', 'lower martam'] },
  { area: 'ranka', coords: [27.3250, 88.5750], aliases: ['ranka', 'ray khola', 'lingdum', 'linddum', 'rey'] },
  { area: 'd.p.h. road', coords: [27.3270, 88.6130], aliases: ['dph road', 'dph rd', 'd p h road', 'd p h rd'] },
  { area: 'p.s. road', coords: [27.3295, 88.6140], aliases: ['ps road', 'ps rd', 'p s road', 'p s rd'] },
  { area: 'church road', coords: [27.3310, 88.6140], aliases: ['church road', 'church rd'] },
  { area: 'indira bypass', coords: [27.3180, 88.6050], aliases: ['indira bypass', 'bypass', 'bye pass'] },
  { area: 'luing / penlong', coords: [27.3500, 88.6300], aliases: ['luing', 'penlong'] },
  { area: 'chongay', coords: [27.3500, 88.6200], aliases: ['chongay', 'chongynek', 'chongey'] },
  { area: 'tathanchen', coords: [27.3360, 88.6210], aliases: ['tathanchen', 'tathangchen', 'upper tathanchen', 'enchey', 'ridge park', 'raj bhawan', 'secretariat', 'tashiling'] },
  { area: 'singtam', coords: [27.2350, 88.4980], aliases: ['singtam'] },
  { area: 'forest colony', coords: [27.3320, 88.6170], aliases: ['forest colony', 'forest coloney', 'denzong regency'] },
  { area: 'amdo golai', coords: [27.3160, 88.6020], aliases: ['amdo golai'] },
  { area: 'lingding', coords: [27.3150, 88.5850], aliases: ['lingding', 'icar road', 'icar rd'] },
  { area: 'nandok', coords: [27.3100, 88.6400], aliases: ['nandok', 'upper nandok'] },
  { area: 'paljor stadium', coords: [27.3320, 88.6150], aliases: ['paljor stadium', 'png school'] },

  // Gyalshing / West Sikkim
  { area: 'upper pelling', coords: [27.3020, 88.2350], aliases: ['upper pelling', 'upper pelling bazar'] },
  { area: 'lower pelling', coords: [27.2950, 88.2380], aliases: ['lower pelling', 'lower pelling bazar'] },
  { area: 'middle pelling', coords: [27.2980, 88.2365], aliases: ['middle pelling'] },
  { area: 'pelling', coords: [27.3004, 88.2357], aliases: ['pelling', 'pelling bazar'] },
  { area: 'gyalshing / geyzing', coords: [27.2880, 88.2450], aliases: ['gyalshing', 'gezing', 'geyzing'] },
  { area: 'yuksom', coords: [27.3692, 88.2185], aliases: ['yuksom', 'yoksom'] },
  { area: 'rinchenpong', coords: [27.2360, 88.2670], aliases: ['rinchenpong'] },
  { area: 'kaluk', coords: [27.2280, 88.2580], aliases: ['kaluk'] },
  { area: 'bermiok', coords: [27.2400, 88.2300], aliases: ['bermiok'] },
  { area: 'dentam', coords: [27.2450, 88.1550], aliases: ['dentam'] },
  { area: 'uttarey', coords: [27.2650, 88.0850], aliases: ['uttarey'] },
  { area: 'legship', coords: [27.2850, 88.2830], aliases: ['legship'] },
  { area: 'tashiding', coords: [27.3400, 88.2900], aliases: ['tashiding', 'chongrang'] },
  { area: 'darap', coords: [27.3200, 88.2200], aliases: ['darap'] },
  { area: 'khecheopalri', coords: [27.3500, 88.2000], aliases: ['khecheopalri', 'khechopari'] },

  // Namchi / South Sikkim
  { area: 'namchi bazar / town', coords: [27.1667, 88.3500], aliases: ['namchi', 'central park', 'samdruptse', 'chardham', 'siddhesvara', 'boomtar'] },
  { area: 'ravangla', coords: [27.3051, 88.3645], aliases: ['ravangla', 'rabongla', 'buddha park'] },
  { area: 'jorethang', coords: [27.1250, 88.3150], aliases: ['jorethang', 'nayabazar', 'kitchudumra'] },
  { area: 'temi tea estate', coords: [27.2380, 88.4210], aliases: ['temi', 'temi tarku', 'tarku'] },
  { area: 'borong', coords: [27.3350, 88.3900], aliases: ['borong'] },
  { area: 'kewzing', coords: [27.3100, 88.3300], aliases: ['kewzing'] },
  { area: 'damthang', coords: [27.2150, 88.3950], aliases: ['damthang'] },
  { area: 'melli', coords: [27.0850, 88.4500], aliases: ['melli'] },
  { area: 'yangang', coords: [27.2800, 88.4500], aliases: ['yangang'] },

  // Mangan / North Sikkim
  { area: 'mangan bazar', coords: [27.4972, 88.5333], aliases: ['mangan', 'ringhim'] },
  { area: 'lachung', coords: [27.6897, 88.7426], aliases: ['lachung', 'katao'] },
  { area: 'lachen', coords: [27.7280, 88.5550], aliases: ['lachen', 'gurudongmar'] },
  { area: 'chungthang', coords: [27.6020, 88.6450], aliases: ['chungthang'] },
  { area: 'yumthang', coords: [27.8250, 88.6950], aliases: ['yumthang', 'shingba'] },
  { area: 'singhik', coords: [27.5150, 88.5450], aliases: ['singhik'] },
  { area: 'dzongu', coords: [27.5250, 88.4950], aliases: ['dzongu', 'passingdang'] },
  { area: 'phodong / kabi', coords: [27.4150, 88.5900], aliases: ['phodong', 'kabi'] },

  // Pakyong
  { area: 'rangpo', coords: [27.1764, 88.5305], aliases: ['rangpo', 'mazi goan', 'mandi bazar'] },
  { area: 'zuluk', coords: [27.2510, 88.7770], aliases: ['zuluk'] },
  { area: 'lingtam', coords: [27.2350, 88.7300], aliases: ['lingtam'] },
  { area: 'rolep', coords: [27.2300, 88.7100], aliases: ['rolep'] },
  { area: 'namcheybong', coords: [27.2300, 88.5700], aliases: ['namcheybong', 'basnett goan'] },
  { area: 'dalapchand', coords: [27.1800, 88.6300], aliases: ['dalapchand', 'mangkhim'] },
  { area: 'pakyong bazar', coords: [27.2450, 88.5880], aliases: ['pakyong', 'dhanbari', 'karthok', 'dickling', 'tashitang', 'bhanu turning'] },
  { area: 'rhenock', coords: [27.1850, 88.6450], aliases: ['rhenock'] },
  { area: 'rongli', coords: [27.2100, 88.7050], aliases: ['rongli', 'chujachen', 'kholatar', 'sundung'] },
  { area: 'aritar', coords: [27.1950, 88.6750], aliases: ['aritar', 'lampokhari'] },
  { area: 'reshi', coords: [27.1650, 88.6550], aliases: ['reshi'] },
  { area: 'majhitar', coords: [27.1980, 88.5350], aliases: ['majhitar'] },

  // Soreng
  { area: 'soreng', coords: [27.1750, 88.2050], aliases: ['soreng'] },
  { area: 'sombaria', coords: [27.1550, 88.1750], aliases: ['sombaria'] },
  { area: 'okhrey', coords: [27.1350, 88.1150], aliases: ['okhrey', 'barsey', 'varsey'] },
  { area: 'chakung', coords: [27.1450, 88.2350], aliases: ['chakung'] }
];

const DISTRICT_FALLBACKS = {
  gangtok: { area: 'gangtok town', coords: [27.3314, 88.6138] },
  gyalshing: { area: 'gyalshing / pelling', coords: [27.2880, 88.2450] },
  namchi: { area: 'namchi', coords: [27.1667, 88.3500] },
  mangan: { area: 'mangan', coords: [27.4972, 88.5333] },
  pakyong: { area: 'pakyong', coords: [27.2450, 88.5880] },
  soreng: { area: 'soreng', coords: [27.1750, 88.2050] }
};

// Deterministic pseudo-random offset (~15-30 meters) so pins along the same road don't overlap exactly
function getJitter(index) {
  const angle = (index * 137.5 * Math.PI) / 180; // Golden angle
  const r = 0.00015 + (index % 5) * 0.00008; // ~15 - 35m
  return {
    dLat: +(r * Math.cos(angle)).toFixed(6),
    dLng: +(r * Math.sin(angle)).toFixed(6)
  };
}

function cleanPhone(contact) {
  if (!contact) return null;
  let str = String(contact).trim();
  if (!str || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'null') return null;
  
  // Split multiple numbers separated by slash or comma
  const first = str.split(/[\/,]/)[0].trim();
  if (!first || first.length < 5) return null;
  return first;
}

function cleanCategory(hotel) {
  const name = (hotel.HotelName || '').toLowerCase();
  if (name.includes('homestay') || name.includes('home stay') || name.includes('cottage') || name.includes('farmstay') || name.includes('villa') || name.includes('retreat')) {
    return 'Homestay';
  } else if (name.includes('hostel') || name.includes('pg') || name.includes('guest house') || name.includes('guesthouse') || name.includes('lodge') || name.includes('dormitory') || name.includes('paying guest') || name.includes('niwas') || name.includes('bhavan') || name.includes('dharamshala') || name.includes('inn')) {
    return 'PG';
  } else {
    return 'Hotel';
  }
}

// Clean address string
function formatAddress(hotel) {
  const parts = [];
  if (hotel.Address && hotel.Address.trim()) parts.push(hotel.Address.trim());
  if (hotel.District && hotel.District.trim()) parts.push(hotel.District.trim());
  parts.push('Sikkim, India');
  return parts.join(', ');
}

function parseEmailWebsite(raw) {
  if (!raw || typeof raw !== 'string') return { email: null, website: null };
  const str = raw.trim();
  if (str === '' || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'null' || str.toLowerCase() === '(new)') {
    return { email: null, website: null };
  }

  let email = null;
  let website = null;

  // Split multiple entries separated by space, comma, or slash
  const parts = str.split(/[\s,]+/);

  for (let part of parts) {
    part = part.trim().replace(/^[\/,\-]+|[\/,\-]+$/g, '');
    if (!part) continue;

    if (part.includes('@') || part.endsWith('gmail.com') || part.endsWith('yahoo.com') || part.endsWith('hmail.com')) {
      if (!part.includes('@') && part.includes('gmail.com')) {
        part = part.replace('gmail.com', '@gmail.com');
      }
      email = part.toLowerCase();
    } else if (part.includes('.com') || part.includes('.in') || part.includes('.org') || part.includes('.net') || part.startsWith('www.') || part.startsWith('http')) {
      let url = part;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      website = url;
    }
  }

  // Handle slashes like martamretreat.com/martamretreat@gmail.com
  if (str.includes('/') && (!email || !website)) {
    const sub = str.split('/');
    for (let s of sub) {
      s = s.trim();
      if (s.includes('@')) {
        email = s.toLowerCase();
      } else if (s.includes('.com') || s.includes('.in') || s.includes('.org') || s.includes('.net') || s.startsWith('www')) {
        website = s.startsWith('http') ? s : 'https://' + s;
      }
    }
  }

  return { email, website };
}

// Map each hotel to the standard shape
const hotels = srcHotels.map((h, i) => {
  const normText = norm(`${h.Address || ''} ${h.District || ''} ${h.HotelName || ''}`);
  
  let matchedArea = null;
  let baseCoords = null;

  for (const loc of LOCALITIES) {
    for (const alias of loc.aliases) {
      if (normText.includes(alias)) {
        matchedArea = loc.area;
        baseCoords = loc.coords;
        break;
      }
    }
    if (matchedArea) break;
  }

  // Fallback to district if not matched
  if (!matchedArea) {
    const distKey = (h.District || 'gangtok').toLowerCase().trim();
    const fallback = DISTRICT_FALLBACKS[distKey] || DISTRICT_FALLBACKS.gangtok;
    matchedArea = fallback.area;
    baseCoords = fallback.coords;
  }

  const jitter = getJitter(i);
  const lat = +(baseCoords[0] + jitter.dLat).toFixed(6);
  const lng = +(baseCoords[1] + jitter.dLng).toFixed(6);

  const { email, website } = parseEmailWebsite(h['Email/Website'] || h.email || h.website);

  return {
    name: (h.HotelName || '').trim(),
    area: matchedArea,
    phone_number: cleanPhone(h.Contact),
    email: email,
    website: website,
    address: formatAddress(h),
    latitude: lat,
    longitude: lng,
    category: cleanCategory(h)
  };
});

const sikkimData = {
  city: 'Sikkim',
  source: 'Sikkim State Tourism Directory',
  note: 'Certified accommodations across Gangtok, Gyalshing, Namchi, Mangan, Pakyong, and Soreng.',
  count: hotels.length,
  hotels: hotels
};

// Write server/data/sikkim.json
const sikkimPath = path.join(__dirname, 'server', 'data', 'sikkim.json');
fs.writeFileSync(sikkimPath, JSON.stringify(sikkimData, null, 2), 'utf8');

// Update server/data/index.json
const indexPath = path.join(__dirname, 'server', 'data', 'index.json');
const indexData = {
  cities: ['Darjeeling', 'Sikkim']
};
fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf8');

console.log(`Successfully generated ${sikkimPath} with ${hotels.length} stays!`);
console.log(`Updated ${indexPath} with cities:`, indexData.cities);

// Category breakdown
const cats = {};
hotels.forEach(h => { cats[h.category] = (cats[h.category] || 0) + 1; });
console.log('Category breakdown in Sikkim:', cats);
