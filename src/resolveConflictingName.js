// @flow

export default (name: string, scope: Object) => {
  let index = 0;
  let resolvedName = name;

  while (scope.hasBinding(resolvedName)) {
    resolvedName = name + index++;

    if (index > 100) {
      throw new Error('Couldn\'t resolve clashing name "' + name + '".');
    }
  }

  return resolvedName;
};
