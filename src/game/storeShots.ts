/** Drop store screenshots into src/assets/store/ (png/jpg/webp). Sorted by file name. */
const mods = import.meta.glob('../assets/store/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const storeShots: string[] = Object.keys(mods)
  .sort()
  .map((k) => mods[k])
