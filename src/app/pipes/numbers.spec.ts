import '@angular/core/testing';
import {NumbersPipe} from './numbers.pipe';

describe('number pipe', function () {

    let numbersFilter: NumbersPipe;

    beforeEach(function () {
        numbersFilter = new NumbersPipe();
    });

    afterAll(function () {
        numbersFilter = null;
    });

    it('should convert item with numbers and letters to item with only numbers', function () {
        expect(numbersFilter.transform('a1b2c3')).toBe('123');
    });
    it('should return message if item does not contain numbers', function () {
        expect(numbersFilter.transform('abc')).toBe('MESSAGE');
    });
    it('should return message if item is empty', function () {
        expect(numbersFilter.transform('')).toBe('MESSAGE');
    });
});


