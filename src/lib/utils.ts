export const getSlotTitle = (name: string) => {
  return name === '' ? 'Default' : name[0].toUpperCase() + name.slice(1);
};

let templates: HTMLTemplateElement[] = [];

export const queryTemplates = (node: Element) => {
  templates = Array.from(node.querySelectorAll('template'));
};

const HOST = 'host';
const SLOT = 'slot';

const getTemplate = (name: string, type: string) => (
  tpl: HTMLTemplateElement
) => {
  const { element, target } = tpl.dataset;
  return element === name && target === type;
};

export const getSlotTemplate = (name: string) =>
  templates.find(getTemplate(name, SLOT));

export const hasSlotTemplate = (name: string) =>
  templates.some(getTemplate(name, SLOT));

export const getHostTemplateNode = (name: string) => {
  const tpl = templates.find(getTemplate(name, HOST));
  return tpl && (tpl.content as DocumentFragment).firstElementChild;
};

export const hasHostTemplate = (name: string) =>
  templates.some(getTemplate(name, HOST));

export const isEmptyArray = (array: unknown[]) => array.length === 0;

export const normalizeType = (type: string | undefined = '') =>
  type.replace(' | undefined', '').replace(' | null', '');
