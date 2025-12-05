export const normalizeOptionValue = (opt: OptionItem): string => {
  return typeof opt === 'string' ? opt : (opt as { value: string }).value;
};

export const normalizeOptionLabel = (opt: OptionItem): string => {
  return typeof opt === 'string' ? opt : (opt as { label: string }).label;
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return 'Not specified';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const toCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};