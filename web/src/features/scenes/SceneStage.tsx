import { useEffect, useState } from 'react'
import { cx } from '@/lib/cx'
import type { SceneId } from './ids'
import { SCENES } from './registry'
import styles from './SceneStage.module.css'

type Layer = { id: SceneId; key: number }

/** A little longer than --duration-scene, so a layer is only removed once the new one fully covers it. */
const SETTLE_MS = 580

/**
 * Hosts the scene on screen. A new scene is mounted over the old one and fades
 * in while the old one dims underneath, then the old one is dropped; the
 * switch itself waits (see `useDeferredValue` in App) until the new scene's
 * code is in, so no loading state ever shows between two scenes.
 */
export function SceneStage({ sceneId, onLoaded }: { sceneId: SceneId; onLoaded: () => void }) {
  const [layers, setLayers] = useState<Layer[]>(() => [{ id: sceneId, key: 0 }])
  const top = layers[layers.length - 1] as Layer

  if (top.id !== sceneId) setLayers([...layers, { id: sceneId, key: top.key + 1 }])

  useEffect(() => {
    if (layers.length < 2) return
    const id = setTimeout(() => setLayers((all) => all.slice(-1)), SETTLE_MS)
    return () => clearTimeout(id)
  }, [layers])

  // Rendering this far means the lazy scene above resolved.
  useEffect(onLoaded, [onLoaded])

  return (
    <>
      {layers.map((layer, i) => {
        const { Component } = SCENES[layer.id]
        return (
          <div
            key={layer.key}
            className={cx(
              styles.layer,
              layer.key > 0 && styles.entering,
              i < layers.length - 1 && styles.leaving,
            )}
          >
            <Component />
          </div>
        )
      })}
    </>
  )
}
