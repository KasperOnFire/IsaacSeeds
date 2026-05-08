export interface HeartSlot {
	color: 'red' | 'soul' | 'black' | 'bone' | 'coin' | 'eternal';
	half?: boolean; // true = half heart
}

export interface Character {
	id: string;
	name: string;
	tainted: boolean;
	spriteUrl: string;
	hearts: HeartSlot[];
	damage: number | null;  // null = random (Eden)
	speed:  number | null;  // null = random (Eden)
}

// Hearts helper: R=red full, r=red half, S=soul full, s=soul half, B=black full, b=black half, O=bone full, o=bone half, C=coin full
function h(s: string): HeartSlot[] {
	return s.split('').map((c) => {
		const map: Record<string, HeartSlot> = {
			R: { color: 'red' },      r: { color: 'red',   half: true },
			S: { color: 'soul' },     s: { color: 'soul',  half: true },
			B: { color: 'black' },    b: { color: 'black', half: true },
			O: { color: 'bone' },     o: { color: 'bone',  half: true },
			C: { color: 'coin' },
			E: { color: 'eternal' },
		};
		return map[c] ?? { color: 'red' };
	});
}

export const BASE_CHARACTERS: Character[] = [
	{ id: 'isaac',          name: 'Isaac',        tainted: false, spriteUrl: '/sprites/isaac.png',          hearts: h('RRR'),    damage: 3.5,  speed: 1.0  },
	{ id: 'magdalene',      name: 'Magdalene',    tainted: false, spriteUrl: '/sprites/magdalene.png',      hearts: h('RRRR'),   damage: 3.5,  speed: 0.85 },
	{ id: 'cain',           name: 'Cain',         tainted: false, spriteUrl: '/sprites/cain.png',           hearts: h('RRs'),    damage: 3.5,  speed: 1.3  },
	{ id: 'judas',          name: 'Judas',        tainted: false, spriteUrl: '/sprites/judas.png',          hearts: h('b'),      damage: 4.05, speed: 0.85 },
	{ id: 'blue_baby',      name: '???',          tainted: false, spriteUrl: '/sprites/blue_baby.png',      hearts: h('SSS'),    damage: 3.5,  speed: 0.85 },
	{ id: 'eve',            name: 'Eve',          tainted: false, spriteUrl: '/sprites/eve.png',            hearts: h('RRs'),    damage: 4.05, speed: 0.85 },
	{ id: 'samson',         name: 'Samson',       tainted: false, spriteUrl: '/sprites/samson.png',         hearts: h('RRRR'),   damage: 3.5,  speed: 0.85 },
	{ id: 'azazel',         name: 'Azazel',       tainted: false, spriteUrl: '/sprites/azazel.png',         hearts: h('bSS'),    damage: 2.0,  speed: 1.25 },
	{ id: 'lazarus',        name: 'Lazarus',      tainted: false, spriteUrl: '/sprites/lazarus.png',        hearts: h('RRR'),    damage: 3.5,  speed: 0.85 },
	{ id: 'eden',           name: 'Eden',         tainted: false, spriteUrl: '/sprites/eden.png',           hearts: h('RS'),     damage: null, speed: null },
	{ id: 'the_lost',       name: 'The Lost',     tainted: false, spriteUrl: '/sprites/the_lost.png',       hearts: [],          damage: 3.5,  speed: 1.3  },
	{ id: 'lilith',         name: 'Lilith',       tainted: false, spriteUrl: '/sprites/lilith.png',         hearts: h('RRs'),    damage: 3.5,  speed: 0.85 },
	{ id: 'keeper',         name: 'Keeper',       tainted: false, spriteUrl: '/sprites/keeper.png',         hearts: h('CC'),     damage: 5.25, speed: 1.3  },
	{ id: 'apollyon',       name: 'Apollyon',     tainted: false, spriteUrl: '/sprites/apollyon.png',       hearts: h('RRs'),    damage: 3.5,  speed: 1.0  },
	{ id: 'the_forgotten',  name: 'The Forgotten',tainted: false, spriteUrl: '/sprites/the_forgotten.png',  hearts: h('OOos'),   damage: 4.35, speed: 1.0  },
	{ id: 'bethany',        name: 'Bethany',      tainted: false, spriteUrl: '/sprites/bethany.png',        hearts: h('RRR'),    damage: 3.5,  speed: 0.85 },
	{ id: 'jacob_and_esau', name: 'Jacob & Esau', tainted: false, spriteUrl: '/sprites/jacob_and_esau.png', hearts: h('RRRSSS'), damage: 3.5,  speed: 1.0  },
];

export const TAINTED_CHARACTERS: Character[] = [
	{ id: 'tainted_isaac',    name: 'T. Isaac',    tainted: true, spriteUrl: '/sprites/tainted_isaac.png',    hearts: h('RRR'),    damage: 3.5,  speed: 1.0  },
	{ id: 'tainted_magdalene',name: 'T. Magdalene',tainted: true, spriteUrl: '/sprites/tainted_magdalene.png',hearts: h('RRRRRR'), damage: 3.5,  speed: 0.85 },
	{ id: 'tainted_cain',     name: 'T. Cain',     tainted: true, spriteUrl: '/sprites/tainted_cain.png',     hearts: h('RR'),     damage: 3.5,  speed: 1.3  },
	{ id: 'tainted_judas',    name: 'T. Judas',    tainted: true, spriteUrl: '/sprites/tainted_judas.png',    hearts: h('BBB'),    damage: 4.05, speed: 0.85 },
	{ id: 'tainted_blue_baby',name: 'T. ???',      tainted: true, spriteUrl: '/sprites/tainted_blue_baby.png',hearts: h('SSS'),    damage: 3.5,  speed: 0.85 },
	{ id: 'tainted_eve',      name: 'T. Eve',      tainted: true, spriteUrl: '/sprites/tainted_eve.png',      hearts: h('RR'),     damage: 4.05, speed: 0.85 },
	{ id: 'tainted_samson',   name: 'T. Samson',   tainted: true, spriteUrl: '/sprites/tainted_samson.png',   hearts: h('RRRR'),   damage: 5.25, speed: 0.85 },
	{ id: 'tainted_azazel',   name: 'T. Azazel',   tainted: true, spriteUrl: '/sprites/tainted_azazel.png',   hearts: h('bSS'),    damage: 2.0,  speed: 1.25 },
	{ id: 'tainted_lazarus',  name: 'T. Lazarus',  tainted: true, spriteUrl: '/sprites/tainted_lazarus.png',  hearts: h('RRR'),    damage: 3.5,  speed: 0.85 },
	{ id: 'tainted_eden',     name: 'T. Eden',     tainted: true, spriteUrl: '/sprites/tainted_eden.png',     hearts: h('RS'),     damage: null, speed: null },
	{ id: 'tainted_lost',     name: 'T. Lost',     tainted: true, spriteUrl: '/sprites/tainted_lost.png',     hearts: [],          damage: 3.5,  speed: 1.3  },
	{ id: 'tainted_lilith',   name: 'T. Lilith',   tainted: true, spriteUrl: '/sprites/tainted_lilith.png',   hearts: h('RRs'),    damage: 3.5,  speed: 0.85 },
	{ id: 'tainted_keeper',   name: 'T. Keeper',   tainted: true, spriteUrl: '/sprites/tainted_keeper.png',   hearts: h('CCC'),    damage: 5.25, speed: 1.3  },
	{ id: 'tainted_apollyon', name: 'T. Apollyon', tainted: true, spriteUrl: '/sprites/tainted_apollyon.png', hearts: h('RRs'),    damage: 3.5,  speed: 1.0  },
	{ id: 'tainted_forgotten',name: 'T. Forgotten',tainted: true, spriteUrl: '/sprites/tainted_forgotten.png',hearts: h('OOO'),    damage: 4.35, speed: 1.0  },
	{ id: 'tainted_bethany',  name: 'T. Bethany',  tainted: true, spriteUrl: '/sprites/tainted_bethany.png',  hearts: h('RRRs'),   damage: 3.5,  speed: 0.85 },
	{ id: 'tainted_jacob',    name: 'T. Jacob',    tainted: true, spriteUrl: '/sprites/tainted_jacob.png',    hearts: h('RRRSSS'), damage: 3.5,  speed: 1.0  },
];

export const ALL_CHARACTERS = [...BASE_CHARACTERS, ...TAINTED_CHARACTERS];

export function findCharacter(id: string): Character | undefined {
	return ALL_CHARACTERS.find((c) => c.id === id);
}
