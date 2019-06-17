import {fakeAsync, tick} from '@angular/core/testing';
import {Subscription} from 'rxjs';
import {FilterParams} from '../../components/filter/models/filterParams';
import {Statuses} from '../../enums/statuses.enum';
import {StringsFilterService} from './stringsFilter.service';

describe('strings filter service', function() {
    let filterService: StringsFilterService;

    beforeEach(function() {
        filterService = new StringsFilterService();
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
