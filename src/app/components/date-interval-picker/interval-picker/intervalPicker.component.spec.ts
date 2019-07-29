import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {DatePickerComponent} from 'app/components/date-interval-picker/datepicker/datePicker.component';
import {IntervalPickerComponent} from 'app/components/date-interval-picker/interval-picker/intervalPicker.component';
import {TimePickerComponent} from 'app/components/date-interval-picker/timepicker/timePicker.component';
import {FilterParamsService} from 'app/services/filter-params/filterParams.service';
import moment from 'moment';
import {Subscription} from 'rxjs';
import {translateTestImport} from 'tests/testTranslationConfig';

describe('interval picker component', function() {
    let component: IntervalPickerComponent;
    let fixture: ComponentFixture<IntervalPickerComponent>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [IntervalPickerComponent, DatePickerComponent, TimePickerComponent],
            imports: [NgbTooltipModule, ReactiveFormsModule, translateTestImport],
            providers: [
                FilterParamsService,
            ],
        }).overrideComponent(DatePickerComponent, {
            set: {changeDetection: ChangeDetectionStrategy.Default},
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');

        fixture = TestBed.createComponent(IntervalPickerComponent);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        translate = null;
        fixtureDebug = null;
    });

    it('check interval selection', function() {
        const DATE_FORMAT: string = 'DD-MM-YYYY HH:mm:ss';
        const subscription: Subscription = component.onSelectDate.subscribe((res) => {
            expect(res).toEqual(`${moment(this.currentDate).startOf('month').format(DATE_FORMAT)}`
                + ` - ${moment(this.currentDate).endOf('month').startOf('day').format(DATE_FORMAT)}`);
        });

        const pickers = fixtureDebug.queryAll(By.css('date-picker'));
        pickers[0].queryAll(By.css('.datepicker-element'))[0].nativeElement.dispatchEvent(new Event('click'));
        const days = pickers[1].queryAll(By.css('.datepicker-element'));
        days[days.length - 1].nativeElement.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        subscription.unsubscribe();
    });
});
