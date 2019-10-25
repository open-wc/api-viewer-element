export const getSlotTitle = (name: string) => {
  return name === '' ? 'Default' : name[0].toUpperCase() + name.slice(1);
};
