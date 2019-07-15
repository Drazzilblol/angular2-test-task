import {fakeAsync, tick} from '@angular/core/testing';
import {StringListItem} from 'app/components/grid/models/StringListItem';
import {Statuses} from 'app/enums/statuses.enum';
import {now} from 'lodash';
import {Subscription} from 'rxjs';
import {GridAddService} from './grid-add.service';

describe('items service', function() {
    let stringsService: GridAddService;

    beforeEach(function() {
        stringsService = new GridAddService();
    });

    afterAll(function() {
        stringsService = null;
    });

    it('check is getObservable() returns value', fakeAsync(function() {
        const testString: StringListItem = new StringListItem('test', new Date(now()), Statuses.FRESH);

        const subscription: Subscription = stringsService.getObservable().subscribe((result: StringListItem) => {
            expect(result).toEqual(testString);
        });

        stringsService.addItem(testString);
        tick(50);
        subscription.unsubscribe();
    }));
});
