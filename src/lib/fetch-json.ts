import { ElementInfo, ElementSetInfo } from './types.js';
import { EMPTY_ELEMENTS } from './constants.js';

export const fetchJson = async (src: string): Promise<ElementInfo[]> => {
  let result = EMPTY_ELEMENTS;
  try {
    const file = await fetch(src);
    const json = (await file.json()) as ElementSetInfo;
    if (Array.isArray(json.tags) && json.tags.length) {
      result = json.tags;
    } else {
      console.error(`No element definitions found at ${src}`);
    }
  } catch (e) {
    console.error(e);
  }
  return result;
};
