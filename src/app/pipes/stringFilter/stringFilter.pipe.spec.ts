import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {now} from 'lodash';
import {translateTestImport} from '../../../tests/testTranslationConfig';
import {FilterParams} from '../../components/filter/models/filterParams';
import {StringListItem} from '../../components/string-list/models/StringListItem';
import {Statuses} from '../../enums/statuses.enum';
import {StringFilterPipe} from './stringFilter.pipe';

describe('string filter pipe', function() {
    let stringFilter: StringFilterPipe;

    beforeEach(function() {
        TestBed.configureTestingModule({
            imports: [translateTestImport],
        });
        stringFilter = new StringFilterPipe(TestBed.get(TranslateService));
    });

    afterAll(function() {
        stringFilter = null;
    });

    it('should return object which contain color', function() {
        const testItem: StringListItem = new StringListItem('123', now(), Statuses.FRESH);
        const stringItems: StringListItem[] = [testItem];

        expect(stringFilter.transform(stringItems, new FilterParams('123', null))).toEqual([testItem]);
    });
});
