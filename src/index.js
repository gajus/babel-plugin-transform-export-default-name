import _ from 'lodash';
import path from 'path';

export default ({
    types: t
}) => {
    let
        deduceName,
        isAnnonFunctionDecl,
        isIdentifierDecl,
        isNamedFunctionDecl,
        resolveClashingName,
        transform;

    isNamedFunctionDecl = (declaration) => {
        return declaration.type === 'FunctionDeclaration' &&
            declaration.id &&
            Boolean(declaration.id.name);
    };

    isIdentifierDecl = (declaration) => {
        return declaration.type === 'Identifier';
    };

    isAnnonFunctionDecl = (declaration) => {
        return (declaration.type === 'FunctionExpression' || declaration.type === 'FunctionDeclaration') &&
            !(declaration.id && declaration.id.name);
    };

    transform = (nodePath, name) => {
        let declaration,
            id;

        declaration = nodePath.node.declaration;
        id = t.identifier(name);
        if (isAnnonFunctionDecl(declaration)) {
            declaration = t.functionExpression(null, declaration.params, declaration.body, declaration.generator);
        }

        nodePath.replaceWithMultiple([
            t.variableDeclaration('let', [t.variableDeclarator(id, declaration)]),
            t.exportDefaultDeclaration(id)
        ]);
    };

    deduceName = (pluginPass, scope) => {
        let name;

        name = pluginPass && pluginPass.file && pluginPass.file.opts && pluginPass.file.opts.filename;
        name = name && path.basename(name, '.js');
        name = name && _.camelCase(name);

        if (!t.isValidIdentifier(name)) {
            throw Error('Invalid identifier "' + name + '".');
        }

        return resolveClashingName(name, scope);
    };

    resolveClashingName = (name, scope) => {
        let index,
            resolvedName;

        index = 0;
        resolvedName = name;
        while (scope.hasBinding(resolvedName) && index < 100) {
            resolvedName = name + index++;
        }
        if (index > 100) {
            throw Error('Couldn\'t resolve clashing name "' + name + '".');
        }
        return resolvedName;
    };

    return {
        visitor: {
            ExportDefaultDeclaration (nodePath, pluginPass) {
                let declaration;

                declaration = nodePath.node.declaration;

                if (isIdentifierDecl(declaration) || isNamedFunctionDecl(declaration)) {
                    return;
                }

                transform(nodePath, deduceName(pluginPass, nodePath.scope));
            }
        }
    };
};
