import {Subscription} from 'rxjs';
import {fakeAsync, tick} from '@angular/core/testing';
import {StringsFilterService} from "./stringsFilter.service";
import {Statuses} from "../../components/status/statuses";

describe('strings filter service', function () {
    let filterService: StringsFilterService;

    beforeEach(function () {
        filterService = new StringsFilterService()
    });

    afterAll(function () {
        filterService = null;
    });

    it('check is getObservable() returns value', fakeAsync(function () {
        let testObject: object = {text: "test", status: Statuses.FRESH};

        let subscription: Subscription = filterService.getObservable().subscribe(result => {
            expect(result).toEqual(testObject);
        });

        filterService.filter(testObject);
        tick(50);
        subscription.unsubscribe();
    }));
});


