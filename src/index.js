import _ from 'lodash';
import path from 'path';

export default ({
    types: t
}) => {
    let
        deduceName,
        isAnnonClassDecl,
        isAnnonFunctionDecl,
        isArrowFunctionDecl,
        resolveClashingName,
        transform;

    isAnnonFunctionDecl = (declaration) => {
        return (declaration.type === 'FunctionExpression' || declaration.type === 'FunctionDeclaration') &&
            !(declaration.id && declaration.id.name);
    };

    isAnnonClassDecl = (declaration) => {
        return (declaration.type === 'ClassExpression' || declaration.type === 'ClassDeclaration') &&
            !(declaration.id && declaration.id.name);
    };

    isArrowFunctionDecl = (declaration) => {
        return declaration.type === 'ArrowFunctionExpression';
    };

    transform = (nodePath, name) => {
        let declaration,
            id;

        declaration = nodePath.node.declaration;
        id = t.identifier(name);

        if (isAnnonFunctionDecl(declaration)) {
            declaration = t.functionExpression(null, declaration.params, declaration.body, declaration.generator);
        } else if (isAnnonClassDecl(declaration)) {
            declaration = t.classExpression(null, declaration.superClass, declaration.body, declaration.decorators || []);
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

                if (isArrowFunctionDecl(declaration) ||
                    isAnnonFunctionDecl(declaration) ||
                    isAnnonClassDecl(declaration)) {
                    transform(nodePath, deduceName(pluginPass, nodePath.scope));
                }
            }
        }
    };
};
