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
    // @todo test anonymous class (should transform)
    // @todo test named class (should not transform)
    // @todo test plain object (should not transform)
    // @todo test non-object (null, string literal, numbers, boolean) (should not transform)
});
