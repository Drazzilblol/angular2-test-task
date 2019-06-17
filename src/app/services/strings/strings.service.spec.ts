import {fakeAsync, tick} from '@angular/core/testing';
import {StringListItem} from 'app/components/string-list/models/StringListItem';
import {Statuses} from 'app/enums/statuses.enum';
import {now} from 'lodash';
import {Subscription} from 'rxjs';
import {StringsService} from './strings.service';

describe('stringListItems service', function() {
    let stringsService: StringsService;

    beforeEach(function() {
        stringsService = new StringsService();
    });

    afterAll(function() {
        stringsService = null;
    });

    it('check is getObservable() returns value', fakeAsync(function() {
        const testString: StringListItem = new StringListItem('test', now(), Statuses.FRESH);

        const subscription: Subscription = stringsService.getObservable().subscribe((result: StringListItem) => {
            expect(result).toEqual(testString);
        });

        stringsService.addString(testString);
        tick(50);
        subscription.unsubscribe();
    }));
});
