'use strict';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

import {StringAdd} from './stringAddController';
import {imports} from '../../../tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';

import english from '../../locales/locale-en.json';
import russian from '../../locales/locale-ru.json';

describe('string add', function () {
    let component: StringAdd;
    let fixture: ComponentFixture<StringAdd>;
    let translate: TranslateService;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, imports],
            declarations: [StringAdd]
        });

        translate = TestBed.get(TranslateService);
        translate.use("en")
    });

    beforeEach(function () {
        fixture = TestBed.createComponent(StringAdd);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
        translate = null;
    });

    it('check add string', function () {
        let testString = 'test';

        component.onAdd = jasmine.createSpy('onAdd');
        let input = fixture.nativeElement.querySelector('input');
        input.value = testString;
        input.dispatchEvent(new Event('input'));
        fixture.nativeElement.querySelector('button').dispatchEvent(new Event('click'));
        expect(component.onAdd).toHaveBeenCalledWith(testString);
    });

    it("check localization", function () {
        let button =  fixture.nativeElement.querySelector('button');
        expect(button.innerText.trim()).toBe(english.BUTTON_ADD);

        translate.use("ru");
        fixture.detectChanges();
        expect(button.innerText.trim()).toBe(russian.BUTTON_ADD);
    });
});


