'use strict';

const fs = require('fs'),
    path = require('path'),
    R = require('ramda'),
    {expect} = require('chai'),
    HeatShield = require('../lib/index');

describe('#run heat-shield', () => {
    const filePath = path.join(__dirname, '../logs/');

    before(done => {
        HeatShield();
        return done();
    });

    it('should create log-file', () => {
        let result;

        fs.readdir(filePath, (err, files) => {
            if (err) throw err;
            else {
                for (const file of files) {
                    if (R.not(R.equals(file, '.gitkeep'))) {
                        result = file;
                    }
                }

                expect(result).to.not.equal('.gitkeep');
            }
        });
    });

    it('should create only one log-file', () => {
        fs.readdir(filePath, (err, files) => {
            if (err) throw err;
            else expect(R.length(files)).to.be.within(1, 2);
        });
    });
});
