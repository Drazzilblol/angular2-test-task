import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {StringGridItem} from 'app/components/grid/models/StringGridItem';
import {Statuses} from 'app/enums/statuses.enum';
import {translateTestImport} from 'tests/testTranslationConfig';
import {FilterService} from './filter.service';

describe('strings filter service', function() {
    let filterService: FilterService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            imports: [translateTestImport],
            providers: [FilterService],
        });
        const translate = TestBed.get(TranslateService);
        translate.use('en');
        filterService = new FilterService(translate);
    });

    afterAll(function() {
        filterService = null;
    });

    it('should return array of filtered items', function() {
        const testItem1: StringGridItem = new StringGridItem('test1', new Date(), Statuses.FRESH);
        const testItem2: StringGridItem = new StringGridItem('test2', new Date(), Statuses.FRESH);
        const stringItems: StringGridItem[] = [testItem1, testItem2];

        expect(filterService.filterItems(stringItems, {transformedText: '2'}))
            .toEqual([testItem2]);
    });
});
