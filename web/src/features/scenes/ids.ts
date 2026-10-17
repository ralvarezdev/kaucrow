export const SCENE_IDS = ['night-sky', 'gallery', 'table', 'growing', 'dotfiles'] as const
export type SceneId = (typeof SCENE_IDS)[number]
