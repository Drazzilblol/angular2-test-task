import {Statuses} from 'app/enums/statuses.enum';
import {ColorsPipe} from './colors.pipe';

describe('colors pipe', function() {

    let colorsPipe: ColorsPipe;

    beforeEach(function() {
        colorsPipe = new ColorsPipe();
    });

    afterAll(function() {
        colorsPipe = null;
    });

    it('should return object which contain color', function() {
        expect(colorsPipe.transform(Statuses.FRESH)).toBe('status-green');
        expect(colorsPipe.transform(Statuses.YESTERDAY)).toBe('status-yellow');
        expect(colorsPipe.transform(Statuses.ROTTEN)).toBe('status-red');
    });
});
