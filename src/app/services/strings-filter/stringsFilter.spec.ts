import {Subscription} from 'rxjs';
import {fakeAsync, tick} from '@angular/core/testing';
import {StringsFilterService} from "./stringsFilter.service";
import {Statuses} from "../../enums/statuses.enum";
import {FilterParams} from "../../components/filter/models/filterParams";

describe('strings filter service', function () {
    let filterService: StringsFilterService;

    beforeEach(function () {
        filterService = new StringsFilterService()
    });

    afterAll(function () {
        filterService = null;
    });

    it('check is getObservable() returns value', fakeAsync(function () {
        let testObject: FilterParams = new FilterParams("test", Statuses.FRESH);

        let subscription: Subscription = filterService.getObservable().subscribe(result => {
            expect(result).toEqual(testObject);
        });

        filterService.filter(testObject);
        tick(50);
        subscription.unsubscribe();
    }));
});


