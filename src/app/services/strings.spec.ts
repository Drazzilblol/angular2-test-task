import {Subscription} from 'rxjs';
import {StringsService} from './strings.service';
import {StringListItem} from '../components/string-list/models/StringListItem';

describe('stringListItems service', function () {
    let stringsService: StringsService;

    beforeEach(function () {
        stringsService = new StringsService()
    });

    afterAll(function () {
        stringsService = null;
    });

    it('check is getObservable() returns value', function () {
        let testString: StringListItem = new StringListItem("test");

        let subscription: Subscription = stringsService.getObservable().subscribe((result: StringListItem) => {
            expect(result).toEqual(testString);
        });

        stringsService.addString(testString);
        subscription.unsubscribe();
    });
});


