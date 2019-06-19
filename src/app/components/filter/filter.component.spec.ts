import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {Statuses} from 'app/enums/statuses.enum';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {StringsFilterService} from 'app/services/strings-filter/stringsFilter.service';
import {findIndex} from 'lodash';
import {translateTestImport} from 'tests/testTranslationConfig';
import {FilterComponent} from './filter.component';
import {FilterParams} from './models/filterParams';

describe('filter.styles.css', function() {
    let component: FilterComponent;
    let fixture: ComponentFixture<FilterComponent>;
    let translate: TranslateService;
    let filterService: StringsFilterService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [FilterComponent],
            imports: [FormsModule, translateTestImport],
            providers: [
                StringsFilterService,
            ],
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');

        fixture = TestBed.createComponent(FilterComponent);
        fixtureDebug = fixture.debugElement;
        filterService = TestBed.get(StringsFilterService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        translate = null;
        filterService = null;
        fixtureDebug = null;
    });

    describe('component', function() {
        it('check filter', function() {
            const filterParams: FilterParams = new FilterParams('test', Statuses.FRESH);
            spyOn(filterService, 'filter');
            const input = fixture.debugElement.query(By.css('input')).nativeElement;
            input.value = filterParams.text;
            input.dispatchEvent(new Event('input'));
            const statusSelect = fixture.debugElement.query(By.css('select')).nativeElement;
            statusSelect.selectedIndex = findIndex(statusSelect.options, (item: HTMLOptionElement) => {
                return item.label === 'Fresh';
            });
            statusSelect.dispatchEvent(new Event('change'));
            fixture.debugElement.query(By.css('.find-button')).nativeElement.dispatchEvent(new Event('click'));

            expect(filterService.filter).toHaveBeenCalledWith(filterParams);
        });

        it('check filter reset', function() {
            const filterParams: FilterParams = new FilterParams(null, null);
            spyOn(filterService, 'filter');
            const input = fixture.debugElement.query(By.css('input')).nativeElement;
            input.value = 'test';
            input.dispatchEvent(new Event('input'));
            const statusSelect = fixture.debugElement.query(By.css('select')).nativeElement;
            statusSelect.selectedIndex = findIndex(statusSelect.options, (item: HTMLOptionElement) => {
                return item.label === 'Fresh';
            });

            statusSelect.dispatchEvent(new Event('change'));
            fixture.debugElement.query(By.css('.reset-button')).nativeElement.dispatchEvent(new Event('click'));

            fixture.whenStable().then(() => {
                expect(input.value).toBe('');
                expect(statusSelect.selectedIndex).toBe(0);
            });

            expect(filterService.filter).toHaveBeenCalledWith(filterParams);
        });

        it('check localization', function() {
            const findButton = fixture.debugElement.query(By.css('.find-button')).nativeElement;
            const resetButton = fixture.debugElement.query(By.css('.reset-button')).nativeElement;
            const statusSelect = fixture.debugElement.query(By.css('select')).nativeElement;
            const title = fixture.debugElement.query(By.css('p:first-of-type')).nativeElement;
            const stat = fixture.debugElement.query(By.css('p:last-of-type')).nativeElement;
            const index: number = findIndex(statusSelect.options, (item: HTMLOptionElement) => {
                return item.label === 'Not selected';
            });

            expect(findButton.innerText.trim()).toBe(english.FILTER.BUTTON_FIND);
            expect(resetButton.innerText.trim()).toBe(english.FILTER.BUTTON_RESET);
            expect(statusSelect.options[index].innerText.trim()).toBe(english.STATUS.NOT_SELECTED);
            expect(title.innerText).toBe(english.FILTER.TITLE);
            expect(stat.innerText).toBe(english.FILTER.STATUS);

            translate.use('ru');
            fixture.detectChanges();

            expect(findButton.innerText.trim()).toBe(russian.FILTER.BUTTON_FIND);
            expect(resetButton.innerText.trim()).toBe(russian.FILTER.BUTTON_RESET);
            expect(statusSelect.options[index].innerText.trim()).toBe(russian.STATUS.NOT_SELECTED);
            expect(title.innerText).toBe(russian.FILTER.TITLE);
            expect(stat.innerText).toBe(russian.FILTER.STATUS);
        });
    });
});
