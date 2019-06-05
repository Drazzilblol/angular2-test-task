import {Subscription} from 'rxjs';
import {StringsService} from './strings.service';
import {StringListItem} from '../components/string-list/models/StringListItem';
import {fakeAsync, tick} from '@angular/core/testing';

describe('stringListItems service', function () {
    let stringsService: StringsService;

    beforeEach(function () {
        stringsService = new StringsService()
    });

    afterAll(function () {
        stringsService = null;
    });

    it('check is getObservable() returns value', fakeAsync(function () {
        let testString: StringListItem = new StringListItem('test');

        let subscription: Subscription = stringsService.getObservable().subscribe((result: StringListItem) => {
            expect(result).toEqual(testString);
        });

        stringsService.addString(testString);
        tick(50);
        subscription.unsubscribe();
    }));
});


