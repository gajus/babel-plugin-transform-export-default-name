// @flow

import camelcase from 'camelcase';

const ValidNameRegex = /^[a-z][a-z0-9]+$/;
const AlphabeticalCharacterRegex = /[a-z]/i;

export default (name: string): string => {
  if (ValidNameRegex.test(name)) {
    return name;
  }

  const firstCharacter = name.slice(0, 1);

  if (!AlphabeticalCharacterRegex.test(firstCharacter)) {
    throw new Error('Invalid name.');
  }

  const firstCharacterUpperCase = firstCharacter.toUpperCase() === firstCharacter;

  const camelCaseName = camelcase(name);

  if (firstCharacterUpperCase) {
    return camelCaseName.slice(0, 1).toUpperCase() + camelCaseName.slice(1);
  }

  return camelCaseName;
};
