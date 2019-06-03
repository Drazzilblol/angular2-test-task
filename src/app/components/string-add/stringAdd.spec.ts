import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {StringAdd} from './stringAdd.component';

import {translateTestImport} from 'tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';

describe('string add', function () {
    let component: StringAdd;
    let fixture: ComponentFixture<StringAdd>;
    let translate: TranslateService;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, translateTestImport],
            declarations: [StringAdd]
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use("en");

        fixture = TestBed.createComponent(StringAdd);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
        translate = null;
    });

    it("check is add button disabled with empty input", function () {
        let button = fixture.nativeElement.querySelector('button');

        expect(button.disabled).toBe(true);

        let input = fixture.nativeElement.querySelector('input');
        input.value = "                ";
        input.dispatchEvent(new Event('input'));

        expect(button.disabled).toBe(true);
    });

    it('check add string', function () {
        let testString = 'test';

        component.onAdd.subscribe(value => {
            expect(value).toEqual(testString);
        });
        let input = fixture.nativeElement.querySelector('input');
        input.value = testString;
        input.dispatchEvent(new Event('input'));
        fixture.nativeElement.querySelector('button').dispatchEvent(new Event('click'));
    });

    it("check localization", function () {
        let button =  fixture.nativeElement.querySelector('button');

        expect(button.innerText.trim()).toBe(english.BUTTON_ADD);

        translate.use("ru");
        fixture.detectChanges();

        expect(button.innerText.trim()).toBe(russian.BUTTON_ADD);
    });
});


