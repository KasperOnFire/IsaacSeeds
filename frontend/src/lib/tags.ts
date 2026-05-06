export interface Tag {
	id: string;
	label: string;
	color: string;
}

export const TAGS: Tag[] = [
	{ id: 'broken_combo',    label: 'Broken Combo',    color: '#8b1a1a' },
	{ id: 'speedrun',        label: 'Speedrun',         color: '#1a4a8b' },
	{ id: 'floor1_item',     label: 'Floor 1 Item',     color: '#2d6b2d' },
	{ id: 'floor1_devil',    label: 'Floor 1 Devil',    color: '#5a1a5a' },
	{ id: 'floor1_angel',    label: 'Floor 1 Angel',    color: '#4a4a8b' },
	{ id: 'mega_satan',      label: 'Mega Satan',       color: '#3d3d3d' },
	{ id: 'delirium',        label: 'Delirium',         color: '#6b1a6b' },
	{ id: 'mother',          label: 'Mother',           color: '#6b3d1a' },
	{ id: 'beast',           label: 'The Beast',        color: '#8b2a1a' },
	{ id: 'greed_mode',      label: 'Greed Mode',       color: '#8b6b1a' },
	{ id: 'angel_rooms',     label: 'Angel Rooms',      color: '#4a5a8b' },
	{ id: 'devil_rooms',     label: 'Devil Rooms',      color: '#6b1a2a' },
	{ id: 'easy_early',      label: 'Easy Early',       color: '#2d5a2d' },
	{ id: 'hard_mode',       label: 'Hard Mode',        color: '#6b2a1a' },
	{ id: 'challenge',       label: 'Challenge',        color: '#4a3a1a' },
	{ id: 'fun',             label: 'Fun',              color: '#1a5a4a' },
	{ id: 'rare_items',      label: 'Rare Items',       color: '#5a2d6b' },
	{ id: 'completion_mark', label: 'Completion Mark',  color: '#2d2d6b' },
];

export function getTag(id: string): Tag | undefined {
	return TAGS.find((t) => t.id === id);
}
