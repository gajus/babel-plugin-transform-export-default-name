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
        getInputCode;

    fixturesPath = path.join(__dirname, './../../test-fixtures');

    getExpectedCode = (name) => {
        return _.trim(fs.readFileSync(path.resolve(fixturesPath, name + '-transformed.js'), 'utf8'));
    };

    getInputCode = (name) => {
        return path.resolve(fixturesPath, name + '.js');
    };

    context('exporting an arrow function', () => {
        context('safe file name', () => {
            it('uses the file name to create a temporary variable; exports the temporary variable', () => {
                let expectedCode,
                    transformedCode;

                expectedCode = getExpectedCode('arrowFunction');

                transformedCode = transformFileSync(getInputCode('arrowFunction'), {
                    babelrc: false,
                    plugins: [
                        plugin
                    ]
                }).code;

                expect(transformedCode).to.equal(expectedCode);
            });
        });
    });
});
