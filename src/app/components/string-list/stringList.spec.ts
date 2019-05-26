'use strict';

import {FormsModule} from '@angular/forms';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {StringList} from './stringListController';
import {NumbersFilter} from '../../pipes/numbersFilter';

describe('string list', function () {
    let component: StringList;
    let fixture: ComponentFixture<StringList>;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, TranslateModule.forRoot()],
            declarations: [StringList, NumbersFilter],
        });
    });

    beforeEach(function () {
        fixture = TestBed.createComponent(StringList);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        component = null;
        fixture = null;
    });

    describe('component', function () {

        it('check string with numbers', function () {
            let testStrings = ['t1e2s3t4'];
            let resultString = '1234';
            component.strings = testStrings;
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('li span').innerText).toBe(resultString);
        });

        it('check items deleting', function () {
            let resultString = '12345';
            component.strings = [resultString];
            fixture.detectChanges();

            let firstElement = fixture.nativeElement.querySelector('li:first-of-type');
            expect(firstElement.querySelector('span').innerText).toBe(resultString);

            component.onDelete = jasmine.createSpy('onDelete');
            firstElement.querySelector('button')
                .dispatchEvent(new Event('click'));
            expect(component.onDelete).toHaveBeenCalledWith(0);

            component.strings.splice(0, 1);
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('li:first-of-type span')).toBe(null);
        });

        it('check string without numbers', function () {
            component.strings = ['test'];
            fixture.detectChanges();

            let firstElement = fixture.nativeElement.querySelector('li:first-of-type span');
            expect(firstElement.innerText).toBe('MESSAGE');
        });

        it('check delete button localization', function () {
            component.strings = ['test'];
            fixture.detectChanges();

            let delButton = fixture.nativeElement.querySelector('li:first-of-type button')
            expect(delButton.innerText).toBe('BUTTON_DELETE');
        });
    });
});


