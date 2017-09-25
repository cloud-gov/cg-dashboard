let idCounter = 0;

export const generateId = prefix => {
  const id = ++idCounter;
  return `${prefix || ''}${id}`;
};
