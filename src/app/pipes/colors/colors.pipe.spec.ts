import {ColorsPipe} from './colors.pipe';
import {Statuses} from '../../enums/statuses.enum';
import {Colors} from '../../enums/colors.enum';

describe('colors pipe', function () {

    let colorsPipe: ColorsPipe;

    beforeEach(function () {
        colorsPipe = new ColorsPipe();
    });

    afterAll(function () {
        colorsPipe = null;
    });

    it('should return object which contain color', function () {
        let input: string = 'background-color';

        expect(colorsPipe.transform(input, Statuses.FRESH)).toEqual({'background-color': Colors.GREEN});
        expect(colorsPipe.transform(input, Statuses.YESTERDAY)).toEqual({'background-color': Colors.YELLOW});
        expect(colorsPipe.transform(input, Statuses.ROTTEN)).toEqual({'background-color': Colors.RED});
    });

});


