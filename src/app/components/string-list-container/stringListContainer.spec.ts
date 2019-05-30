'use strict';

import {StringListContainer} from './stringListContainerController';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {StringList} from '../string-list/stringListController';
import {StringAdd} from '../string-add/stringAddController';
import {NumbersFilter} from '../../pipes/numbersFilter';
import {translateTestImport} from '../../../tests/TestTranslationConfig';

describe('string list container', function () {
    let component: StringListContainer;
    let fixture: ComponentFixture<StringListContainer>;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, translateTestImport],
            declarations: [StringListContainer, StringList, StringAdd, NumbersFilter],
        });
    });

    beforeEach(function () {
        fixture = TestBed.createComponent(StringListContainer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
    });

    describe('component', function () {

        it('check add item', function () {
            let testString = '12345';
            let stringAdd = fixture.nativeElement.querySelector('string-add');

            let input = stringAdd.querySelector('input');
            input.value = testString;
            input.dispatchEvent(new Event('input'));

            stringAdd.querySelector('button')
                .dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('li:first-of-type span').innerText).toBe(testString);
        });

        it('check delete item', function () {
            let resultString = '12345';
            component.stringList = [resultString];

            fixture.detectChanges();
            fixture.nativeElement.querySelector('li:first-of-type button').dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('li:first-of-type span')).toBe(null);
        });
    });
});


