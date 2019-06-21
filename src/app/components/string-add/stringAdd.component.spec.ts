import {DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {StringsService} from 'app/services/strings/strings.service';
import {Subscription} from 'rxjs';
import {translateTestImport} from 'tests/testTranslationConfig';
import {StringListItem} from '../string-list/models/StringListItem';
import {StringAdd} from './stringAdd.component';

describe('item add', function() {
    let component: StringAdd;
    let fixture: ComponentFixture<StringAdd>;
    let translate: TranslateService;
    let stringsService: StringsService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [StringAdd],
            imports: [NgbTooltipModule, ReactiveFormsModule, translateTestImport],
            providers: [StringsService],
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');
        fixture = TestBed.createComponent(StringAdd);
        fixtureDebug = fixture.debugElement;
        stringsService = TestBed.get(StringsService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        translate = null;
        stringsService = null;
        fixtureDebug = null;
    });

    it('check is add button disabled with empty input', function() {
        const button = fixtureDebug.query(By.css('button')).nativeElement;

        expect(button.disabled).toBe(true);
    });

    it('check add item', fakeAsync(function() {
        const testString: string = 'test';

        const subscription: Subscription = stringsService.getObservable().subscribe((result: StringListItem) => {
            expect(result.originText).toBe(testString);
        });

        const input = fixtureDebug.query(By.css('input')).nativeElement;
        input.value = testString;
        input.dispatchEvent(new Event('input'));
        fixtureDebug.query(By.css('button')).nativeElement.dispatchEvent(new Event('click'));
        tick(50);
        subscription.unsubscribe();
    }));

    it('check localization', function() {
        const button = fixtureDebug.query(By.css('button')).nativeElement;

        expect(button.innerText.trim()).toBe(english.BUTTON_ADD);

        translate.use('ru');
        fixture.detectChanges();

        expect(button.innerText.trim()).toBe(russian.BUTTON_ADD);
    });
});
