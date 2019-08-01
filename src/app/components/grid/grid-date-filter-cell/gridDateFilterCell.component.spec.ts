import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {DatePickerComponent} from 'app/components/date-interval-picker/datepicker/datePicker.component';
import {IntervalPickerComponent} from 'app/components/date-interval-picker/interval-picker/intervalPicker.component';
import {TimePickerComponent} from 'app/components/date-interval-picker/timepicker/timePicker.component';
import {GridDateFilterCellComponent} from 'app/components/grid/grid-date-filter-cell/gridDateFilterCell.component';
import {Columns} from 'app/enums/columns.enum';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {DatePickerManagerService} from 'app/services/date-picker-manager/datePickerManager.service';
import {translateTestImport} from 'tests/testTranslationConfig';

describe('date filter cell component', function() {
    let component: GridDateFilterCellComponent;
    let fixture: ComponentFixture<GridDateFilterCellComponent>;
    let fixtureDebug: DebugElement;
    let columnManager: ColumnManagerService;
    let translate: TranslateService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridDateFilterCellComponent, IntervalPickerComponent, DatePickerComponent,
                TimePickerComponent],
            imports: [ReactiveFormsModule, translateTestImport, NgbTooltipModule],
            providers: [ColumnManagerService, DatePickerManagerService],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [IntervalPickerComponent],
            },
        }).compileComponents();

        fixture = TestBed.createComponent(GridDateFilterCellComponent);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;
        translate = TestBed.get(TranslateService);
        translate.use('en');
        columnManager = TestBed.get(ColumnManagerService);
        columnManager.addColumn(new Column(Columns.DATE, ColumnsTypes.DATE, 'date', 400,
            {
                filterable: true,
            }));
        component.index = 0;
        component.column = columnManager.getColumns()[0];
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        fixtureDebug = null;
        columnManager = null;
        translate = null;
    });

    it('check is date picker open/close', function() {
        const input = fixtureDebug.query(By.css('input')).nativeElement;
        input.dispatchEvent(new Event('click', {
            bubbles: true,
        }));

        expect(fixtureDebug.query(By.css('interval-picker'))).not.toBe(null);

        fixtureDebug.nativeElement.parentNode.dispatchEvent(new Event('click', {
            bubbles: true,
        }));
        fixture.detectChanges();

        expect(fixtureDebug.query(By.css('interval-picker'))).toBe(null);
    });

    it('should restore selected dates after repeat opening', function() {
        fixtureDebug.query(By.css('input')).nativeElement
            .dispatchEvent(new Event('click', {
                bubbles: true,
            }));
        fixture.detectChanges();
        let pickers = fixtureDebug.queryAll(By.css('date-picker'));
        let firstSelectedDay = pickers[0].queryAll(By.css('.datepicker-element'))[15].nativeElement;
        firstSelectedDay.dispatchEvent(new Event('click'));
        let days = pickers[1].queryAll(By.css('.datepicker-element'));
        days[days.length - 1].nativeElement.dispatchEvent(new Event('click'));
        fixtureDebug.nativeElement.parentNode.dispatchEvent(new Event('click', {
            bubbles: true,
        }));
        fixture.detectChanges();

        expect(fixtureDebug.query(By.css('interval-picker'))).toBe(null);

        fixtureDebug.query(By.css('input')).nativeElement
            .dispatchEvent(new Event('click', {
                bubbles: true,
            }));
        fixture.detectChanges();

        pickers = fixtureDebug.queryAll(By.css('date-picker'));
        firstSelectedDay = pickers[0].queryAll(By.css('.datepicker-element'))[15].nativeElement;
        days = pickers[1].queryAll(By.css('.datepicker-element'));

        expect(firstSelectedDay.style.backgroundColor).toBe('lightblue');
        expect(days[days.length - 1].nativeElement.style.backgroundColor).toBe('lightblue');

    });
});
