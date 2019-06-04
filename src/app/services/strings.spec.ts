import {Subscription} from 'rxjs';
import {StringsService} from './strings.service';

describe('strings service', function () {
    let stringsService: StringsService;

    beforeEach(function () {
        stringsService = new StringsService()
    });

    afterAll(function () {
        stringsService = null;
    });

    it('check is getObservable() returns value', function () {
        let testString: string = 'test';

        let subscription: Subscription = stringsService.getObservable().subscribe((result: string) => {
            expect(result).toBe(testString);
        });

        stringsService.addString(testString);
        subscription.unsubscribe();
    });
});


