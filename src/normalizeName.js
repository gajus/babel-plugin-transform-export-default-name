// @flow

import camelcase from 'camelcase';

const ValidNameRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]+$/;
const AlphabeticalCharacterRegex = /[a-zA-Z_$]/i;

export default (name: string): string => {
  if (ValidNameRegex.test(name)) {
    return name;
  }

  let firstCharacter = name.slice(0, 1);

  if (!AlphabeticalCharacterRegex.test(firstCharacter)) {
    firstCharacter = '_';
    name = '_' + name;
  }

  const firstCharacterUpperCase = firstCharacter.toUpperCase() === firstCharacter;

  const camelCaseName = camelcase(name);

  if (firstCharacterUpperCase) {
    return camelCaseName.slice(0, 1).toUpperCase() + camelCaseName.slice(1);
  }

  return camelCaseName;
};
