import {fakeAsync, tick} from '@angular/core/testing';
import {Subscription} from 'rxjs';
import {FilterParamsService} from './filterParams.service';

describe('strings filter params service', function() {
    let filterService: FilterParamsService;

    beforeEach(function() {
        filterService = new FilterParamsService();
    });

    afterAll(function() {
        filterService = null;
    });

    it('check is getObservable() returns value', fakeAsync(function() {
        const testObject = {test: 'test'};

        const subscription: Subscription = filterService.getObservable().subscribe((result) => {
            expect(result).toEqual(testObject);
        });

        filterService.filter(testObject);
        tick(50);
        subscription.unsubscribe();
    }));
});
