import {fakeAsync, tick} from '@angular/core/testing';
import {StringGridItem} from 'app/components/grid/models/StringGridItem';
import {Statuses} from 'app/enums/statuses.enum';
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
        const testString: StringGridItem = new StringGridItem('test', new Date(), Statuses.FRESH);

        const subscription: Subscription = stringsService.getObservable().subscribe((result: StringGridItem) => {
            expect(result).toEqual(testString);
        });

        stringsService.addItem(testString);
        tick(50);
        subscription.unsubscribe();
    }));
});
