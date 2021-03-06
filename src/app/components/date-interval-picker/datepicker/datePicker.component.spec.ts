import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {DatePickerComponent} from 'app/components/date-interval-picker/datepicker/datePicker.component';
import {TimePickerComponent} from 'app/components/date-interval-picker/timepicker/timePicker.component';
import {FilterParamsService} from 'app/services/filter-params/filterParams.service';
import moment from 'moment';
import {translateTestImport} from 'tests/testTranslationConfig';

describe('date picker component', function() {
    let component: DatePickerComponent;
    let fixture: ComponentFixture<DatePickerComponent>;
    let translate: TranslateService;
    let filterService: FilterParamsService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [DatePickerComponent, TimePickerComponent],
            imports: [NgbTooltipModule, ReactiveFormsModule, translateTestImport],
            providers: [
                FilterParamsService,
            ],
        }).overrideComponent(DatePickerComponent, {
            set: {changeDetection: ChangeDetectionStrategy.Default},
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');

        fixture = TestBed.createComponent(DatePickerComponent);
        fixtureDebug = fixture.debugElement;
        filterService = TestBed.get(FilterParamsService);
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

    it('check month change', function() {
        component.currentDate = moment('2019/02/01', 'YYYY/MM/DD');
        component.recalculateMonth();
        fixture.detectChanges();

        expect(fixtureDebug.queryAll(By.css('.month-changer>span'))[1].nativeElement.innerText)
            .toBe('February 2019');
        expect(component.thisMonth.length).toBe(28);

        fixtureDebug.query(By.css('.icon-right')).nativeElement
            .dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(fixtureDebug.queryAll(By.css('.month-changer>span'))[1].nativeElement.innerText)
            .toBe('March 2019');
        expect(component.thisMonth.length).toBe(31);
    });

    it('check days order', function() {
        component.currentDate = moment('2019/02/01', 'YYYY/MM/DD');
        component.recalculateMonth();
        fixture.detectChanges();

        const dates = fixtureDebug.queryAll(By.css('.datepicker-element'));
        expect(dates[0].nativeElement.style.gridColumn).toBe('5 / auto');
        expect(dates[0].nativeElement.style.gridRow).toBe('1 / auto');
        expect(dates[dates.length - 1].nativeElement.style.gridColumn).toBe('4 / auto');
        expect(dates[dates.length - 1].nativeElement.style.gridRow).toBe('5 / auto');
    });

    it('check dates selection', fakeAsync(function() {
        component.currentDate = moment('2019/02/01', 'YYYY/MM/DD');
        component.recalculateMonth();
        fixture.detectChanges();
        const dates = fixtureDebug.queryAll(By.css('.datepicker-element'));
        dates[0].nativeElement.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        component.onSelectDate.subscribe((result) => {
            expect(result).toEqual(component.thisMonth[dates.length - 1].date);
        });

        dates[dates.length - 1].nativeElement.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick(50);
    }));

    it('check localization', function() {
        component.currentDate = moment('2019/02/01', 'YYYY/MM/DD');
        component.recalculateMonth();
        fixture.detectChanges();
        translate.use('ru');
        fixture.detectChanges();

        expect(fixtureDebug.queryAll(By.css('.month-changer>span'))[1].nativeElement.innerText)
            .toBe('Февраль 2019');
    });
});
