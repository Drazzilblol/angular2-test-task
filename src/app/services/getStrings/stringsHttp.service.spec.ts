import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {forEach} from 'lodash';
import {StringsHttpService} from './stringsHttp.service';

describe('strings http service', function() {
    let httpService: StringsHttpService;
    let httpMock: HttpTestingController;

    beforeEach(function() {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [StringsHttpService],
        });

        httpService = TestBed.get(StringsHttpService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterAll(function() {
        httpMock.verify();
        httpService = null;
    });

    it('check is observable returns value', function() {
        const data = [
            {filter: 'test1', date: 1560435761965, status: 'FRESH'},
            {filter: 'test2', date: 1560435761966, status: 'FRESH'},
            {filter: 'test3', date: 1560435761967, status: 'FRESH'},
        ];

        httpService.getStrings().subscribe((result) => {
            expect(result.length).toBe(3);
            forEach(result, (item, i) => {
                expect(item.originText).toBe(data[i].filter);
            });
        });

        const req = httpMock.expectOne('http://localhost:3000/strings');
        expect(req.request.method).toBe('GET');
        req.flush(data);
    });
});
