import {fakeAsync, tick} from '@angular/core/testing';
import {FilterParams} from 'app/components/filter/models/filterParams';
import {Statuses} from 'app/enums/statuses.enum';
import {Subscription} from 'rxjs';
import {FilterService} from './filter.service';

describe('strings filter service', function() {
    let filterService: FilterService;

    beforeEach(function() {
        filterService = new FilterService();
    });

    afterAll(function() {
        filterService = null;
    });

    it('check is getObservable() returns value', fakeAsync(function() {
        const testObject: FilterParams = new FilterParams('test', Statuses.FRESH);

        const subscription: Subscription = filterService.getObservable().subscribe((result) => {
            expect(result).toEqual(testObject);
        });

        filterService.filter(testObject);
        tick(50);
        subscription.unsubscribe();
    }));
});
