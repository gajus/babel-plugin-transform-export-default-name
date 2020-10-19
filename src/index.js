// @flow

import deriveName from './deriveName';

export default ({
  types: t
}: {
  types: Object
}) => {
  const replace = (path, name: string, replacement) => {
    const id = t.identifier(name);

    const [varDeclPath] = path.replaceWithMultiple([
      t.variableDeclaration('const', [
        t.variableDeclarator(id, replacement)
      ]),
      t.exportDefaultDeclaration(id)
    ]);

    path.scope.registerDeclaration(varDeclPath);
  };

  return {
    visitor: {
      ExportDefaultDeclaration (path: Object, state: Object) {
        const declaration = path.node.declaration;

        if (declaration.id && declaration.id.name) {
          return;
        }

        const name = deriveName(state, path.scope);

        if (t.isArrowFunctionExpression(declaration)) {
          const declarationReplacement = t.arrowFunctionExpression(declaration.params, declaration.body, declaration.generator);

          declarationReplacement.async = declaration.async;

          replace(path, name, declarationReplacement);

          return;
        }

        if (t.isFunctionDeclaration(declaration)) {
          const declarationReplacement = t.functionExpression(null, declaration.params, declaration.body, declaration.generator);

          declarationReplacement.async = declaration.async;

          replace(path, name, declarationReplacement);

          return;
        }

        if (t.isFunctionExpression(declaration)) {
          const declarationReplacement = t.functionExpression(null, declaration.params, declaration.body, declaration.generator);

          declarationReplacement.async = declaration.async;

          replace(path, name, declarationReplacement);

          return;
        }

        if (t.isClassDeclaration(declaration)) {
          const declarationReplacement = t.classExpression(null, declaration.superClass, declaration.body, declaration.decorators || []);

          replace(path, name, declarationReplacement);

          // eslint-disable-next-line no-useless-return
          return;
        }
      }
    }
  };
};
