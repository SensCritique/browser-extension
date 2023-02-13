export const flatten = (string: string): string | null => {
  return (
    string
      ?.replace(/ *\([^)]*\) */g, '')
      .replace(/[^\w ]/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase() || null
  )
}
