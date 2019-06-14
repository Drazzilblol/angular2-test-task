import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {NgbActiveModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {translateTestImport} from 'tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';
import {FilterComponent} from "./filter.component";
import {StringsFilterService} from "../../services/strings-filter/stringsFilter.service";
import english from "../../locales/locale-en.json";
import russian from "../../locales/locale-ru.json";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {Subscription} from "rxjs";
import {Statuses} from "../status/statuses";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";

describe('filter', function () {
    let component: FilterComponent;
    let fixture: ComponentFixture<FilterComponent>;
    let translate: TranslateService;
    let filterService: StringsFilterService;
    let fixtureDebug: DebugElement;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, translateTestImport, NgbModalModule, NoopAnimationsModule],
            declarations: [FilterComponent],
            providers: [
                NgbActiveModal,
                StringsFilterService
            ]
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');

        fixture = TestBed.createComponent(FilterComponent);
        fixtureDebug = fixture.debugElement;
        filterService = TestBed.get(StringsFilterService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
        translate = null;
        filterService = null;
        fixtureDebug = null;
    });

    describe('component', function () {
        it('check filtration', fakeAsync(function () {
            let testString: string = 'test';
            let testStatus: Statuses = Statuses.FRESH;

            let subscription: Subscription = filterService.getObservable().subscribe(result => {
                expect(result.text).toBe(testString);
                expect(result.status).toBe(testStatus);
            });

            let input = fixture.debugElement.query(By.css('input')).nativeElement;
            input.value = testString;
            input.dispatchEvent(new Event('input'));
            let statusSelect = fixture.debugElement.query(By.css('select')).nativeElement;
            statusSelect.selectedIndex = 1;
            statusSelect.dispatchEvent(new Event('change'));

            fixture.debugElement.query(By.css('button')).nativeElement.dispatchEvent(new Event('click'));
            tick(50);
            subscription.unsubscribe()
        }));

        it('check localization', function () {
            let filterButton = fixture.debugElement.query(By.css('button')).nativeElement;
            let statusSelect = fixture.debugElement.query(By.css('select')).nativeElement;
            let title = fixture.debugElement.query(By.css('p:first-of-type')).nativeElement;
            let stat = fixture.debugElement.query(By.css('p:last-of-type')).nativeElement;

            expect(filterButton.innerText.trim()).toBe(english.FILTER.BUTTON_FIND);
            expect(statusSelect.options[0].innerText.trim()).toBe(english.STATUS.NOT_SELECTED);
            expect(title.innerText).toBe(english.FILTER.TITLE);
            expect(stat.innerText).toBe(english.FILTER.STATUS);

            translate.use('ru');
            fixture.detectChanges();

            expect(filterButton.innerText.trim()).toBe(russian.FILTER.BUTTON_FIND);
            expect(statusSelect.options[0].innerText.trim()).toBe(russian.STATUS.NOT_SELECTED);
            expect(title.innerText).toBe(russian.FILTER.TITLE);
            expect(stat.innerText).toBe(russian.FILTER.STATUS);
        });
    });
});



