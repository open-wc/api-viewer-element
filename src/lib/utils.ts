export const getSlotTitle = (name: string) => {
  return name === '' ? 'Default' : name[0].toUpperCase() + name.slice(1);
};

const templates: Array<HTMLTemplateElement[]> = [];

export const setTemplates = (id: number, tpl: HTMLTemplateElement[]) => {
  templates[id] = tpl;
};

const HOST = 'host';
const SLOT = 'slot';

const getTemplate = (name: string, type: string) => (
  tpl: HTMLTemplateElement
) => {
  const { element, target } = tpl.dataset;
  return element === name && target === type;
};

export const getSlotTemplate = (id: number, name: string) =>
  templates[id].find(getTemplate(name, SLOT));

export const hasSlotTemplate = (id: number, name: string) =>
  templates[id].some(getTemplate(name, SLOT));

export const getHostTemplateNode = (id: number, name: string) => {
  const tpl = templates[id].find(getTemplate(name, HOST));
  return tpl && (tpl.content as DocumentFragment).firstElementChild;
};

export const hasHostTemplate = (id: number, name: string) =>
  templates[id].some(getTemplate(name, HOST));

export const isEmptyArray = (array: unknown[]) => array.length === 0;

export const normalizeType = (type: string | undefined = '') =>
  type.replace(' | undefined', '').replace(' | null', '');
