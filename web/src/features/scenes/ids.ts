export const SCENE_IDS = ['night-sky', 'gallery', 'table'] as const
export type SceneId = (typeof SCENE_IDS)[number]
