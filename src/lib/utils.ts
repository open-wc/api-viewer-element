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

const isHostTemplate = (tpl: HTMLTemplateElement) => {
  return tpl.dataset.target === 'host';
};

export const getSlotTemplate = (name: string) => {
  return templates.find(t => isTemplate(t, name) && !isHostTemplate(t));
};

export const hasSlotTemplate = (name: string) => {
  return templates.some(t => isTemplate(t, name) && !isHostTemplate(t));
};

export const getHostTemplateNode = (name: string) => {
  const tpl = templates.find(t => isTemplate(t, name) && isHostTemplate(t));
  return tpl && (tpl.content as DocumentFragment).firstElementChild;
};

export const hasHostTemplate = (name: string) => {
  return templates.some(tpl => isTemplate(tpl, name) && isHostTemplate(tpl));
};

export const isEmptyArray = (array: unknown[]) => array.length === 0;

export const normalizeType = (type: string | undefined = '') =>
  type.replace(' | undefined', '').replace(' | null', '');
