export const unquote = (value?: string): string | undefined =>
  typeof value === 'string' && value.startsWith("'") && value.endsWith("'")
    ? value.slice(1, value.length - 1)
    : value;

const capitalize = (name: string): string =>
  name[0].toUpperCase() + name.slice(1);

export const getSlotContent = (name: string, initial = 'content'): string =>
  capitalize(name === '' ? initial : name);
