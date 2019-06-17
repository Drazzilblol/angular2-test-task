import {Statuses} from '../../enums/statuses.enum';
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
        expect(colorsPipe.transform(Statuses.FRESH)).toEqual({'status-green': true});
        expect(colorsPipe.transform(Statuses.YESTERDAY)).toEqual({'status-yellow': true});
        expect(colorsPipe.transform(Statuses.ROTTEN)).toEqual({'status-red': true});
    });
});
