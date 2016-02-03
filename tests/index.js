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

describe('plugin', () => {
    context('Test valid file names', () => {
        const fixturesDir = path.join(__dirname, 'fixtures/valid');

        _.forEach(fs.readdirSync(fixturesDir), (fileName) => {
            if (!fileName.match(/^transformed-|.map/)) {
                it('Test ' + fileName, () => {
                    const expectedCode = _.trim(fs.readFileSync(path.resolve(fixturesDir, 'transformed-' + fileName), 'utf8')),
                        transformedCode = transformFileSync(path.resolve(fixturesDir, fileName), {
                            babelrc: false,
                            plugins: [
                                plugin
                            ]
                        }).code;

                    expect(transformedCode).to.equal(expectedCode);
                });
            }
        });
    });
    // context('Invalid file names', () => {

    // });
});
