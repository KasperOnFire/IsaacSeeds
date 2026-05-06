export interface Character {
	id: string;
	name: string;
	tainted: boolean;
	spriteUrl: string;
}

export const BASE_CHARACTERS: Character[] = [
	{ id: 'isaac',          name: 'Isaac',         tainted: false, spriteUrl: '/sprites/isaac.png' },
	{ id: 'magdalene',      name: 'Magdalene',      tainted: false, spriteUrl: '/sprites/magdalene.png' },
	{ id: 'cain',           name: 'Cain',           tainted: false, spriteUrl: '/sprites/cain.png' },
	{ id: 'judas',          name: 'Judas',          tainted: false, spriteUrl: '/sprites/judas.png' },
	{ id: 'blue_baby',      name: '???',            tainted: false, spriteUrl: '/sprites/blue_baby.png' },
	{ id: 'eve',            name: 'Eve',            tainted: false, spriteUrl: '/sprites/eve.png' },
	{ id: 'samson',         name: 'Samson',         tainted: false, spriteUrl: '/sprites/samson.png' },
	{ id: 'azazel',         name: 'Azazel',         tainted: false, spriteUrl: '/sprites/azazel.png' },
	{ id: 'lazarus',        name: 'Lazarus',        tainted: false, spriteUrl: '/sprites/lazarus.png' },
	{ id: 'eden',           name: 'Eden',           tainted: false, spriteUrl: '/sprites/eden.png' },
	{ id: 'the_lost',       name: 'The Lost',       tainted: false, spriteUrl: '/sprites/the_lost.png' },
	{ id: 'lilith',         name: 'Lilith',         tainted: false, spriteUrl: '/sprites/lilith.png' },
	{ id: 'keeper',         name: 'Keeper',         tainted: false, spriteUrl: '/sprites/keeper.png' },
	{ id: 'apollyon',       name: 'Apollyon',       tainted: false, spriteUrl: '/sprites/apollyon.png' },
	{ id: 'the_forgotten',  name: 'The Forgotten',  tainted: false, spriteUrl: '/sprites/the_forgotten.png' },
	{ id: 'bethany',        name: 'Bethany',        tainted: false, spriteUrl: '/sprites/bethany.png' },
	{ id: 'jacob_and_esau', name: 'Jacob & Esau',   tainted: false, spriteUrl: '/sprites/jacob_and_esau.png' },
];

export const TAINTED_CHARACTERS: Character[] = [
	{ id: 'tainted_isaac',          name: 'Tainted Isaac',        tainted: true, spriteUrl: '/sprites/tainted_isaac.png' },
	{ id: 'tainted_magdalene',      name: 'Tainted Magdalene',    tainted: true, spriteUrl: '/sprites/tainted_magdalene.png' },
	{ id: 'tainted_cain',           name: 'Tainted Cain',         tainted: true, spriteUrl: '/sprites/tainted_cain.png' },
	{ id: 'tainted_judas',          name: 'Tainted Judas',        tainted: true, spriteUrl: '/sprites/tainted_judas.png' },
	{ id: 'tainted_blue_baby',      name: 'Tainted ???',          tainted: true, spriteUrl: '/sprites/tainted_blue_baby.png' },
	{ id: 'tainted_eve',            name: 'Tainted Eve',          tainted: true, spriteUrl: '/sprites/tainted_eve.png' },
	{ id: 'tainted_samson',         name: 'Tainted Samson',       tainted: true, spriteUrl: '/sprites/tainted_samson.png' },
	{ id: 'tainted_azazel',         name: 'Tainted Azazel',       tainted: true, spriteUrl: '/sprites/tainted_azazel.png' },
	{ id: 'tainted_lazarus',        name: 'Tainted Lazarus',      tainted: true, spriteUrl: '/sprites/tainted_lazarus.png' },
	{ id: 'tainted_eden',           name: 'Tainted Eden',         tainted: true, spriteUrl: '/sprites/tainted_eden.png' },
	{ id: 'tainted_lost',           name: 'Tainted Lost',         tainted: true, spriteUrl: '/sprites/tainted_lost.png' },
	{ id: 'tainted_lilith',         name: 'Tainted Lilith',       tainted: true, spriteUrl: '/sprites/tainted_lilith.png' },
	{ id: 'tainted_keeper',         name: 'Tainted Keeper',       tainted: true, spriteUrl: '/sprites/tainted_keeper.png' },
	{ id: 'tainted_apollyon',       name: 'Tainted Apollyon',     tainted: true, spriteUrl: '/sprites/tainted_apollyon.png' },
	{ id: 'tainted_forgotten',      name: 'Tainted Forgotten',    tainted: true, spriteUrl: '/sprites/tainted_forgotten.png' },
	{ id: 'tainted_bethany',        name: 'Tainted Bethany',      tainted: true, spriteUrl: '/sprites/tainted_bethany.png' },
	{ id: 'tainted_jacob',          name: 'Tainted Jacob',        tainted: true, spriteUrl: '/sprites/tainted_jacob.png' },
];

export const ALL_CHARACTERS = [...BASE_CHARACTERS, ...TAINTED_CHARACTERS];

export function findCharacter(id: string): Character | undefined {
	return ALL_CHARACTERS.find((c) => c.id === id);
}
