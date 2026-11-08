/**
 * Turns a pixel grid, one character per pixel with '.' for empty, into one SVG path per character. Each
 * horizontal run of the same character becomes a single rectangle, so a sprite stays small and crisp.
 */
export function gridPaths<K extends string = string>(
  rows: readonly string[],
): Partial<Record<K, string>> {
  const out: Record<string, string> = {}
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const c = row[x] as string
      if (c === '.') {
        x++
        continue
      }
      let end = x
      while (row[end + 1] === c) end++
      const run = end - x + 1
      out[c] = `${out[c] ?? ''}M${x} ${y}h${run}v1h${-run}z`
      x = end + 1
    }
  })
  return out as Partial<Record<K, string>>
}
