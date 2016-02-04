import _ from 'lodash';
import path from 'path';

export default ({
    types: t
}) => {
    return {
        visitor: {
            ExportDefaultDeclaration (nodePath, pluginPass) {
                let declaration,
                    fileName,
                    id;

                fileName = pluginPass && pluginPass.file && pluginPass.file.opts && pluginPass.file.opts.filename;
                fileName = fileName && path.basename(fileName, '.js');
                fileName = _.camelCase(fileName);
                id = t.identifier(fileName);
                declaration = nodePath.node.declaration;

                if (!fileName || !declaration || declaration.type === 'Identifier') {
                    return;
                }
                if (!t.isValidIdentifier(fileName)) {
                    throw Error('Invalid identifier "' + fileName + '".');
                }
                nodePath.replaceWithMultiple([
                    t.variableDeclaration('let', [t.variableDeclarator(id, declaration)]),
                    t.exportDefaultDeclaration(id)
                ]);
            }
        }
    };
};
