export const unquote = (value?: string): string | undefined =>
  typeof value === 'string' && value.startsWith("'") && value.endsWith("'")
    ? value.slice(1, value.length - 1)
    : value;

export function html(
  strings: TemplateStringsArray,
  ...values: string[]
): HTMLTemplateElement {
  const template = document.createElement('template');
  template.innerHTML = values.reduce(
    (acc, v, idx) => acc + v + strings[idx + 1],
    strings[0]
  );
  return template;
}
