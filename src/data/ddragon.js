// Data Dragon / CommunityDragon ?�이�?URL ?�틸
// ?�용 규칙
// - version(ddVer): fetchDDragonVersion() 로드 결과�?그�?�??�달?�니?? (?? "15.18.1")
// - championName: Riot 챔피???�문 ??(?? "Ahri"). 공백/?�수문자 ?�는 ?��? ?��? 기�??�니??
// - itemId: ?�수 ?�이??ID. Match-V5 participants.item0~item6 그�?�??�용 가?�합?�다.
// - spellId / perkId: ?�자 ID. ?�펠/룬�? ?�일명이 ??문자??기반?�라 추�? 매핑???�요?�니??
export function buildChampionSquareUrl(version, championName) {
  const safeVer = version || '15.18.1';
  const key = championName || 'Aatrox';
  return `https://ddragon.leagueoflegends.com/cdn/${safeVer}/img/champion/${key}.png`;
}
export function buildItemIconUrl(version, itemId) {
  const safeVer = version || '15.18.1';
  const idNum = Number(itemId);
  if (!Number.isFinite(idNum) || idNum <= 0) return ''; // �??�롯 처리
  return `https://ddragon.leagueoflegends.com/cdn/${safeVer}/img/item/${idNum}.png`;
}
// ===== 캐시 =====
const spellMapCache = new Map();      // key: `${ver}|${lang}` -> Map<number, spellKey>
const runePerkMapByVer  = new Map();  // ver -> Map<perkId, iconPath>
const runeStyleMapByVer = new Map();  // ver -> Map<styleId, iconPath>
// ===== ?�수 =====
export const PLACEHOLDER_IMG = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
// 720x(?�거?? ?��????�이�?고정 매핑 (OP.GG ?��???경로)
const STYLE_720X_BY_ID = {
  8000: 'perk-images/Styles/7201_Precision.png',   // Precision
  8100: 'perk-images/Styles/7200_Domination.png',  // Domination
  8200: 'perk-images/Styles/7203_Sorcery.png',     // Sorcery
  8300: 'perk-images/Styles/7202_Inspiration.png', // Inspiration (?�거??Whimsy 명칭 ?�?��? ?�래?�서 처리)
  8400: 'perk-images/Styles/7204_Resolve.png',     // Resolve
};
// ===== ?�펠 ?�이�?=====
export function tryBuildSummonerSpellIconUrl(version, spellId, fallback = PLACEHOLDER_IMG, lang = 'en_US') {
  const safeVer = version || '15.18.1';
  const cacheKey = `${safeVer}|${lang}`;
  const map = spellMapCache.get(cacheKey);
  const key = map?.get(Number(spellId));
  return key ? `https://ddragon.leagueoflegends.com/cdn/${safeVer}/img/spell/${key}.png` : fallback;
}
// ?�펠 매핑 로더: summonerId(number) -> spell key(string id)
export async function loadSpellMap(version, lang = 'en_US') {
  const safeVer = version || '15.18.1';
  const cacheKey = `${safeVer}|${lang}`;
  if (spellMapCache.has(cacheKey)) return spellMapCache.get(cacheKey);
  try {
    const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${safeVer}/data/${lang}/summoner.json`);
    if (!res.ok) throw new Error('spell json fetch failed');
    const json = await res.json();
    const map = new Map();
    Object.values(json?.data || {}).forEach((sp) => {
      const num = Number(sp?.key);
      const id = sp?.id; // e.g., SummonerFlash
      if (!Number.isNaN(num) && id) map.set(num, id);
    });
    spellMapCache.set(cacheKey, map);
    return map;
  } catch {
    const map = new Map();
    spellMapCache.set(cacheKey, map);
    return map;
  }
}
// ===== �??�크/?��??? ?�이�?=====
// 개별 ?�크 ?�이�? runesReforged.json??r.icon??그�?�??�용 (?? perk-images/Styles/Precision/Conqueror/Conqueror.png)
export function tryBuildRuneIconUrl(perkId, fallback = PLACEHOLDER_IMG) {
  if (perkId == null) return fallback;
  const id = Number(perkId);
  // 1) loadRuneMap()가 채운 runePerkMapByVer?�서 찾기
  const maps = Array.from(runePerkMapByVer.values());
  const rel = maps.find((m) => m.has(id))?.get(id);
  if (rel) {
    return `https://ddragon.leagueoflegends.com/cdn/img/${rel}`;
  }
  // 2) ?�드코딩 ?�백: ?�정 ?�스???�히 Sorcery)??간헐?�으�?매핑?��? ?�을 ??
  const HARDCODED_PERK_ICON_BY_ID = {
    // Sorcery (마법)
    8214: 'perk-images/Styles/Sorcery/SummonAery/SummonAery.png', // 콩콩???�환
    8229: 'perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png', // ?�비로운 ?�성
    8230: 'perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png', // ?�입
    // Domination (지�? ?�???�스?�들(?�비)
    8112: 'perk-images/Styles/Domination/Electrocute/Electrocute.png',
    8128: 'perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png',
    9923: 'perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png',
    // Precision (?��?) ?�???�스?�들(?�비)
    8005: 'perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png',
    8008: 'perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png',
    8021: 'perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png',
    8010: 'perk-images/Styles/Precision/Conqueror/Conqueror.png',
    // Resolve (결의) ?�???�스?�들(?�비)
    8437: 'perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png',
    8439: 'perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png',
    8465: 'perk-images/Styles/Resolve/Guardian/Guardian.png',
    // Inspiration (?�감) ?�???�스?�들(?�비)
    8351: 'perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png',
    8360: 'perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png',
    8369: 'perk-images/Styles/Domination/FirstStrike/FirstStrike.png', // First Strike가 Domination 경로???�치?��?�??�감 계열 ?�스??
  };
  if (HARDCODED_PERK_ICON_BY_ID[id]) {
    return `https://ddragon.leagueoflegends.com/cdn/img/${HARDCODED_PERK_ICON_BY_ID[id]}`;
  }
  try {
    console.debug('[DEBUG_LOG] Rune icon not resolved for perkId=', id);
  } catch {}
  return fallback;
}
// ?��????�리) ?�이�? 720x 고정 매핑 ??runesReforged.style.icon ??placeholder
export function buildRuneStyleIcon(styleId, fallback = PLACEHOLDER_IMG) {
  const id = Number(styleId);
  if (!Number.isFinite(id)) return fallback;
  // 1) 720x 고정 매핑 ?�선
  const path720 = STYLE_720X_BY_ID[id];
  if (path720) {
    return `https://ddragon.leagueoflegends.com/cdn/img/${path720}`;
  }
  // 2) runesReforged.json?�서 로드??style.icon 경로 ?�백
  const maps = Array.from(runeStyleMapByVer.values());
  const rel = maps.find((m) => m.has(id))?.get(id);
  if (rel) {
    return `https://ddragon.leagueoflegends.com/cdn/img/${rel}`;
  }
  // 3) 최종 ?�백
  return fallback;
}
// 보조 ?��???추론: perkId???�이�?경로???�함???��????�름?�로 ?��???ID ?�추
export function inferStyleIdFromPerkId(perkId) {
  if (perkId == null) return null;
  const id = Number(perkId);
  if (!Number.isFinite(id)) return null;
  const maps = Array.from(runePerkMapByVer.values());
  const rel = maps.find((m) => m.has(id))?.get(id) || '';
  const s = String(rel);
  if (!s) return null;
  // 경로 ?? perk-images/Styles/Precision/Conqueror/Conqueror.png
  if (s.includes('/Precision/')) return 8000;
  if (s.includes('/Domination/')) return 8100;
  if (s.includes('/Sorcery/')) return 8200;
  if (s.includes('/Inspiration/')) return 8300;
  if (s.includes('/Resolve/')) return 8400;
  const lower = s.toLowerCase();
  if (lower.includes('/precision/')) return 8000;
  if (lower.includes('/domination/')) return 8100;
  if (lower.includes('/sorcery/')) return 8200;
  if (lower.includes('/inspiration/')) return 8300;
  if (lower.includes('/resolve/')) return 8400;
  return null;
}
// �??�이�??��????�이�?매핑 로더
export async function loadRuneMap(version, lang = 'en_US') {
  const safeVer = version || '15.18.1';
  if (runePerkMapByVer.has(safeVer) && runeStyleMapByVer.has(safeVer)) {
    return { perk: runePerkMapByVer.get(safeVer), style: runeStyleMapByVer.get(safeVer) };
  }
  try {
    const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${safeVer}/data/${lang}/runesReforged.json`);
    if (!res.ok) throw new Error('runes json fetch failed');
    const arr = await res.json();
    const perkMap  = new Map(); // r.id -> r.icon
    const styleMap = new Map(); // style.id -> style.icon
    (arr || []).forEach((style) => {
      if (typeof style?.id === 'number' && style?.icon) {
        styleMap.set(style.id, style.icon);
      }
      (style?.slots || []).forEach((slot) => {
        (slot?.runes || []).forEach((r) => {
          if (typeof r?.id === 'number' && r?.icon) {
            perkMap.set(r.id, r.icon);
          }
        });
      });
    });
    runePerkMapByVer.set(safeVer, perkMap);
    runeStyleMapByVer.set(safeVer, styleMap);
    return { perk: perkMap, style: styleMap };
  } catch {
    const empty = new Map();
    runePerkMapByVer.set(safeVer, empty);
    runeStyleMapByVer.set(safeVer, empty);
    return { perk: empty, style: empty };
  }
}
// ===== ??�� ?�블??=====
// ??�� ?�블??URL 빌더(CommunityDragon)
export function buildRankEmblemUrl(tier) {
  const t = String(tier || 'GOLD').toLowerCase();
  return `https://raw.communitydragon.org/latest/game/assets/ux/ranked-emblems/league-emblem-${t}.png`;
}
// OPGG ?�블???�백 URL (커�??�티?�래�?onError ??1???�용)
export function buildOpggEmblemFallbackUrl(tier, rank) {
  const t = String(tier || 'GOLD').toLowerCase();
  const roman = String(rank || '').toUpperCase();
  const map = { I: 1, II: 2, III: 3, IV: 4 };
  const n = map[roman] || 1;
  return `https://opgg-static.akamaized.net/images/medals/${t}_${n}.png?image=q_auto,f_webp,w_144`;
}
// ===== ?�티�?감정?�현) =====
export function buildStickerUrl(stickerId, size = 'small') {
  const sizeMap = { small: '32x32', medium: '64x64', large: '128x128' };
  const sizeStr = sizeMap[size] || '32x32';
  return `https://raw.communitydragon.org/latest/game/assets/ux/emotes/${stickerId}.png`;
}
export async function loadStickers() {
  try {
    const res = await fetch('https://raw.communitydragon.org/latest/game/data/ux/emotes/emotes.bin.json');
    if (!res.ok) throw new Error('Failed to fetch stickers');
    await res.json(); // ?�제 ?�싱?� ?�요 ???�장
    // ?�모 ?�이??(?�서비스?�선 ??JSON???�싱)
    return [
      { id: 'emote_01', name: '기쁨', description: '기쁜 감정?�현', price: 50,  category: 'emotion', image: buildStickerUrl('emote_01') },
      { id: 'emote_02', name: '?�픔', description: '?�픈 감정?�현', price: 50,  category: 'emotion', image: buildStickerUrl('emote_02') },
      { id: 'emote_03', name: '?�남', description: '?�난 감정?�현', price: 50,  category: 'emotion', image: buildStickerUrl('emote_03') },
      { id: 'emote_04', name: '?�??, description: '?�?� 감정?�현', price: 50,  category: 'emotion', image: buildStickerUrl('emote_04') },
      { id: 'emote_05', name: '?�랑', description: '?�랑 감정?�현', price: 100, category: 'emotion', image: buildStickerUrl('emote_05') },
      { id: 'emote_06', name: '?�음', description: '?�는 감정?�현', price: 75,  category: 'emotion', image: buildStickerUrl('emote_06') },
      { id: 'emote_07', name: '?�리', description: '?�리 감정?�현', price: 150, category: 'victory', image: buildStickerUrl('emote_07') },
      { id: 'emote_08', name: '?�배', description: '?�배 감정?�현', price: 100, category: 'defeat',  image: buildStickerUrl('emote_08') },
    ];
  } catch (error) {
    console.warn('Failed to load stickers, using fallback data:', error);
    // ?�백 ?�모 ?�이??
    return [
      { id: 'emote_01', name: '기쁨', description: '기쁜 감정?�현', price: 50,  category: 'emotion', image: 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Ahri.png' },
      { id: 'emote_02', name: '?�픔', description: '?�픈 감정?�현', price: 50,  category: 'emotion', image: 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Yasuo.png' },
      { id: 'emote_03', name: '?�남', description: '?�난 감정?�현', price: 50,  category: 'emotion', image: 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Jinx.png' },
      { id: 'emote_04', name: '?�??, description: '?�?� 감정?�현', price: 50,  category: 'emotion', image: 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Lux.png' },
      { id: 'emote_05', name: '?�랑', description: '?�랑 감정?�현', price: 100, category: 'emotion', image: 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Thresh.png' },
      { id: 'emote_06', name: '?�음', description: '?�는 감정?�현', price: 75,  category: 'emotion', image: 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Zed.png' },
      { id: 'emote_07', name: '?�리', description: '?�리 감정?�현', price: 150, category: 'victory', image: 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Darius.png' },
      { id: 'emote_08', name: '?�배', description: '?�배 감정?�현', price: 100, category: 'defeat',  image: 'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/champion/Aatrox.png' },
    ];
  }
}
// CommunityDragon 기반 감정?�현(?�모?? 목록 로더
// 참고: latest/plugins/rcp-be-lol-game-data/global/default/v1/emotes.json
export async function loadEmotes() {
  try {
    const res = await fetch(
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/emotes.json'
    );
    if (!res.ok) throw new Error('Failed to fetch emotes');
    const arr = await res.json();
    const toImgUrl = (inventoryIcon) => {
      if (!inventoryIcon) return PLACEHOLDER_IMG;
      const norm = String(inventoryIcon).replace(/^\/+/, '');
      if (/^plugins\//i.test(norm)) {
        return `https://raw.communitydragon.org/latest/${norm}`;
      }
      if (/^lol-game-data\//i.test(norm)) {
        return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${norm}`;
      }
      if (/^game\//i.test(norm)) {
        return `https://raw.communitydragon.org/latest/${norm}`;
      }
      return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${norm}`;
    };
    const emotes = (arr || [])
        .filter((e) => e && (e.inventoryIcon || e.name))
        .map((e) => ({
          id: `emote_${e.id}`,
          name: e.name || `Emote ${e.id}`,
          description: '공식 감정?�현(?�모??',
          price: 75,
          category: 'emote',
          image: toImgUrl(e.inventoryIcon),
        }));
    return emotes;
  } catch (err) {
    console.warn('Failed to load emotes, fallback to empty list:', err);
    return [];
  }
// ?�적 720x ?��????�이�?URL 반환 (styleId: 8000~8400)
export function getStyleStaticIcon(styleId, fallback = PLACEHOLDER_IMG) {
  const id = Number(styleId)
  if (!Number.isFinite(id)) return fallback
  // 1) runesReforged??style.icon 경로 ?�선 ?�용 (CDN AccessDenied ?�피)
  const maps = Array.from(runeStyleMapByVer.values())
  const rel = maps.find((m) => m.has(id))?.get(id)
  if (rel) {
    return `https://ddragon.leagueoflegends.com/cdn/img/${rel}`
  }
  // 2) 720x 고정 경로 ?�백
  const path720 = STYLE_720X_BY_ID[id]
  if (path720) {
    return `https://ddragon.leagueoflegends.com/cdn/img/${path720}`
  }
  try { console.debug('[DEBUG_LOG] Unknown styleId for icon:', id) } catch {}
  // 3) 최종 ?�백
  return fallback
}

