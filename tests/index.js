/* eslint-disable max-nested-callbacks */
import _ from 'lodash';
import {
    expect
}
from 'chai';
import {
    transformFileSync
}
from 'babel-core';
import plugin from './../src';
import fs from 'fs';
import path from 'path';

describe('babel-plugin-transform-export-default-name', () => {
    let fixturesPath,
        getExpectedCode,
        getInputCode,
        test;

    fixturesPath = path.join(__dirname, './../../test-fixtures');

    getExpectedCode = (name) => {
        return _.trim(fs.readFileSync(path.resolve(fixturesPath, name + '-transformed.js'), 'utf8'));
    };

    getInputCode = (name) => {
        return path.resolve(fixturesPath, name + '.js');
    };

    test = (name) => {
        let expectedCode,
            transformedCode;

        expectedCode = getExpectedCode(name);

        transformedCode = transformFileSync(getInputCode(name), {
            babelrc: false,
            plugins: [
                'syntax-jsx',
                plugin
            ]
        }).code;

        expect(transformedCode).to.equal(expectedCode);
    };

    context('exporting an arrow function', () => {
        context('safe file name', () => {
            it('uses the file name to create a temporary variable; exports the temporary variable', () => {
                test('arrowFunction');
            });
        });
        context('unsafe file name', () => {
            it('uses _.camelCase to normalize the file name; uses normalized name to create a temporary variable; exports the temporary variable', () => {
                test('unsafe-name');
            });
        });
        context('clashing name', () => {
            it('it incrementally appends a numeric index (starting 0) until there is no name conflict', () => {
                test('clashingName');
            });
        });
        context('index file name', () => {
            it('it uses the dirname instead of file name if file name is "index"', () => {
                test('index');
            });
        });
    });

    context('exporting an anonymous function', () => {
        context('safe file name', () => {
            it('uses the file name to create a temporary variable; exports the temporary variable', () => {
                test('anonymousFunction');
            });
        });
    });

    context('exporting named function', () => {
        it('does not transform code', () => {
            test('namedFunction');
        });
    });

    context('exporting anonymous class', () => {
        context('safe file name', () => {
            it('uses the file name to create a temporary variable for the class; exports the temporary variable', () => {
                test('anonymousClass');
            });
        });
    });

    context('exporting named class', () => {
        it('does not transform code', () => {
            test('namedClass');
        });
    });

    context('exporting plain object', () => {
        it('does not transform code', () => {
            test('object');
        });
    });


    context('exporting non object: null', () => {
        it('does not transform code', () => {
            test('nullValue');
        });
    });

    context('exporting non object: string', () => {
        it('does not transform code', () => {
            test('stringValue');
        });
    });

    context('exporting non object: number', () => {
        it('does not transform code', () => {
            test('numberValue');
        });
    });

    context('exporting non object: boolean', () => {
        it('does not transform code', () => {
            test('booleanValue');
        });
    });

    context('exporting string object', () => {
        it('does not transform code', () => {
            test('stringObject');
        });
    });

    context('exporting new string object', () => {
        it('does not transform code', () => {
            test('newStringObject');
        });
    });

    context('exporting array', () => {
        it('does not transform code', () => {
            test('array');
        });
    });

    context('exporting anonymous class (React component)', () => {
        it('uses the file name to create a temporary variable; exports the temporary variable', () => {
            test('reactAnnonClass');
        });
    });
});
