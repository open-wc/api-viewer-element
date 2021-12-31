export const unquote = (value?: string): string | undefined =>
  typeof value === 'string' && value.startsWith("'") && value.endsWith("'")
    ? value.slice(1, value.length - 1)
    : value;
