import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {StringAdd} from './stringAdd.component';
import {translateTestImport} from 'tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {StringsService} from '../../services/strings/strings.service';
import {Subscription} from 'rxjs';
import {StringListItem} from '../string-list/models/StringListItem';
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('item add', function () {
    let component: StringAdd;
    let fixture: ComponentFixture<StringAdd>;
    let translate: TranslateService;
    let stringsService: StringsService;
    let fixtureDebug: DebugElement;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, translateTestImport],
            declarations: [StringAdd],
            providers: [StringsService]
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');
        fixture = TestBed.createComponent(StringAdd);
        fixtureDebug = fixture.debugElement;
        stringsService = TestBed.get(StringsService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
        translate = null;
        stringsService = null;
        fixtureDebug = null;
    });

    it('check is add button disabled with empty input', function () {
        let button = fixtureDebug.query(By.css('button')).nativeElement;

        expect(button.disabled).toBe(true);

        let input = fixture.nativeElement.querySelector('input');
        input.value = '                ';
        input.dispatchEvent(new Event('input'));

        expect(button.disabled).toBe(true);
    });

    it('check add item', fakeAsync(function () {
        let testString: string = 'test';

        let subscription: Subscription = stringsService.getObservable().subscribe((result: StringListItem) => {
            expect(result.originText).toBe(testString)
        });

        let input = fixtureDebug.query(By.css('input')).nativeElement;
        input.value = testString;
        input.dispatchEvent(new Event('input'));
        fixtureDebug.query(By.css('button')).nativeElement.dispatchEvent(new Event('click'));
        tick(50);
        subscription.unsubscribe()
    }));

    it('check localization', function () {
        let button = fixtureDebug.query(By.css('button')).nativeElement;

        expect(button.innerText.trim()).toBe(english.BUTTON_ADD);

        translate.use('ru');
        fixture.detectChanges();

        expect(button.innerText.trim()).toBe(russian.BUTTON_ADD);
    });
});