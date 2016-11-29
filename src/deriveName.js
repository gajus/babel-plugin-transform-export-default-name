// @flow

import path from 'path';
import normalizeName from './normalizeName';
import resolveConflictingName from './resolveConflictingName';

export default (state: Object, scope: Object): string => {
  const filename = state.file.opts.filename;

  let name = filename;

  name = path.basename(name, '.js');

  if (name === 'index') {
    name = path.basename(path.dirname(filename));
  }

  name = normalizeName(name);

  return resolveConflictingName(name, scope);
};
