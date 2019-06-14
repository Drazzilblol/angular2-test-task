import '@angular/core/testing';
import {now} from 'lodash'
import {StringFilterPipe} from "./stringFilter.pipe";
import {Statuses} from "../../enums/statuses.enum";
import {StringListItem} from "../../components/string-list/models/StringListItem";
import {FilterParams} from "../../components/filter/models/filterParams";
import {TestBed} from "@angular/core/testing";
import {TranslateService} from "@ngx-translate/core";
import {translateTestImport} from "../../../tests/TestTranslationConfig";

describe('string filter pipe', function () {

    let stringFilter: StringFilterPipe;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [translateTestImport],
        });
        stringFilter = new StringFilterPipe(TestBed.get(TranslateService));
    });

    afterAll(function () {
        stringFilter = null;
    });

    it('should return object which contain color', function () {
        let testItem: StringListItem = new StringListItem("123", now(), Statuses.FRESH);
        let stringItems: StringListItem[] = [testItem];

        expect(stringFilter.transform(stringItems, new FilterParams("123", null))).toEqual([testItem]);
    });
});