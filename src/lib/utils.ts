export const getSlotTitle = (name: string) => {
  return name === '' ? 'Default' : name[0].toUpperCase() + name.slice(1);
};

let templates: HTMLTemplateElement[] = [];

export const queryTemplates = (node: Element) => {
  templates = Array.from(node.querySelectorAll('template'));
};

export const getTemplate = (name: string) => {
  return templates.find(tpl => tpl.dataset.element === name);
};

export const hasTemplate = (name: string) => {
  return templates.some(tpl => tpl.dataset.element === name);
};

export const isEmptyArray = (array: unknown[]) => array.length === 0;
