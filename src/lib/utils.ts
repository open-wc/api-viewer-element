export const getSlotTitle = (name: string) => {
  return name === '' ? 'Default' : name[0].toUpperCase() + name.slice(1);
};

const templates: Array<HTMLTemplateElement[]> = [];

export const setTemplates = (id: number, tpl: HTMLTemplateElement[]) => {
  templates[id] = tpl;
};

export const TemplateTypes = Object.freeze({
  HOST: 'host',
  SLOT: 'slot',
  PREFIX: 'prefix',
  SUFFIX: 'suffix',
  WRAPPER: 'wrapper'
});

export const isTemplate = (node: unknown): node is HTMLTemplateElement =>
  node instanceof HTMLTemplateElement;

const matchTemplate = (name: string, type: string) => (
  tpl: HTMLTemplateElement
) => {
  const { element, target } = tpl.dataset;
  return element === name && target === type;
};

export const getTemplateNode = (node: unknown) =>
  isTemplate(node) && node.content.firstElementChild;

export const getTemplate = (id: number, name: string, type: string) =>
  templates[id].find(matchTemplate(name, type));

export const hasTemplate = (id: number, name: string, type: string) =>
  templates[id].some(matchTemplate(name, type));

export const isEmptyArray = (array: unknown[]) => array.length === 0;

export const normalizeType = (type: string | undefined = '') =>
  type.replace(' | undefined', '').replace(' | null', '');
