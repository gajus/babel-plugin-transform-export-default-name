// @flow

import camelcase from 'camelcase';

const ValidNameRegex = /^[$A-Z_a-z][\w$]+$/u;
const AlphabeticalCharacterRegex = /[$_a-z]/iu;

export default (name: string): string => {
  if (ValidNameRegex.test(name)) {
    return name;
  }

  const firstCharacter = name.slice(0, 1);

  const firstCharacterUpperCase = firstCharacter.toUpperCase() === firstCharacter;

  const camelCaseName = camelcase(name);

  let safeName = camelCaseName;
  if (firstCharacterUpperCase) {
    safeName = camelCaseName.slice(0, 1).toUpperCase() + camelCaseName.slice(1);
  }

  if (!AlphabeticalCharacterRegex.test(firstCharacter)) {
    safeName = '_' + safeName;
  }

  return safeName;
};
