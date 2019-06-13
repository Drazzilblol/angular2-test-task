import '@angular/core/testing';
import {now} from 'lodash'
import {StringFilterPipe} from "./stringFilter.pipe";
import {Statuses} from "../../components/status/statuses";
import {StringListItem} from "../../components/string-list/models/StringListItem";
import {FilterParams} from "../../components/filter/models/filterParams";

describe('string filter pipe', function () {

    let stringFilter: StringFilterPipe;

    beforeEach(function () {
        stringFilter = new StringFilterPipe();
    });

    afterAll(function () {
        stringFilter = null;
    });

    it('should return object which contain color', function () {
        let testItem: StringListItem = new StringListItem("123", now(), Statuses.FRESH)
        let stringItems: StringListItem[] = [testItem];

        expect(stringFilter.transform(stringItems, new FilterParams("123", null))).toEqual([testItem]);

    });

});


