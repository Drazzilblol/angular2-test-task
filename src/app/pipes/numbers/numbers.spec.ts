import '@angular/core/testing';
import {NumbersPipe} from './numbers.pipe';

describe('number pipe', function () {

    let numbersPipe: NumbersPipe;

    beforeEach(function () {
        numbersPipe = new NumbersPipe();
    });

    afterAll(function () {
        numbersPipe = null;
    });

    it('should convert item with numbers and letters to item with only numbers', function () {
        expect(numbersPipe.transform('a1b2c3')).toBe('123');
    });
    it('should return message if item does not contain numbers', function () {
        expect(numbersPipe.transform('abc')).toBe('MESSAGE');
    });
    it('should return message if item is empty', function () {
        expect(numbersPipe.transform('')).toBe('MESSAGE');
    });
});


