'use strict';

import '@angular/core/testing';

import {NumbersFilter} from './numbersFilter';

describe('number filter', function () {

    let numbersFilter: NumbersFilter;

    beforeEach(function () {
        numbersFilter = new NumbersFilter();
    });

    afterAll(function () {
        numbersFilter = null;
    });

    it('should convert string with numbers and letters to string with only numbers', function () {
        expect(numbersFilter.transform('a1b2c3')).toBe('123');
    });
    it('should return message if string does not contain numbers', function () {
        expect(numbersFilter.transform('abc')).toBe('MESSAGE');
    });
    it('should return message if string is empty', function () {
        expect(numbersFilter.transform('')).toBe('MESSAGE');
    });
});


