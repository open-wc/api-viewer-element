export const getSlotTitle = (name: string) => {
  return name === '' ? 'Default' : name[0].toUpperCase() + name.slice(1);
};

let templates: HTMLTemplateElement[] = [];

export const queryTemplates = (node: Element) => {
  templates = Array.from(node.querySelectorAll('template'));
};

const isTemplate = (tpl: HTMLTemplateElement, name: string) => {
  return tpl.dataset.element === name;
};

const HOST = 'host';
const SLOT = 'slot';

const getTarget = (tpl: HTMLTemplateElement) => tpl.dataset.target;

export const getSlotTemplate = (name: string) =>
  templates.find(t => isTemplate(t, name) && getTarget(t) === SLOT);

export const hasSlotTemplate = (name: string) =>
  templates.some(t => isTemplate(t, name) && getTarget(t) === SLOT);

export const getHostTemplateNode = (name: string) => {
  const tpl = templates.find(t => isTemplate(t, name) && getTarget(t) === HOST);
  return tpl && (tpl.content as DocumentFragment).firstElementChild;
};

export const hasHostTemplate = (name: string) =>
  templates.some(t => isTemplate(t, name) && getTarget(t) === HOST);

export const isEmptyArray = (array: unknown[]) => array.length === 0;

export const normalizeType = (type: string | undefined = '') =>
  type.replace(' | undefined', '').replace(' | null', '');
