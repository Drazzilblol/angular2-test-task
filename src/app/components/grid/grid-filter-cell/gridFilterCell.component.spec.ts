import {DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {DatePickerComponent} from 'app/components/date-interval-picker/datepicker/datePicker.component';
import {IntervalPickerComponent} from 'app/components/date-interval-picker/interval-picker/intervalPicker.component';
import {TimePickerComponent} from 'app/components/date-interval-picker/timepicker/timePicker.component';
import {GridFilterCellComponent} from 'app/components/grid/grid-filter-cell/gridFilterCell.component';
import {Columns} from 'app/enums/columns.enum';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {DatePickerManagerService} from 'app/services/date-picker-manager/datePickerManager.service';
import {Subscription} from 'rxjs';
import {translateTestImport} from 'tests/testTranslationConfig';

describe('filter cell component', function() {
    let component: GridFilterCellComponent;
    let fixture: ComponentFixture<GridFilterCellComponent>;
    let fixtureDebug: DebugElement;
    let columnManager: ColumnManagerService;
    let translate: TranslateService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridFilterCellComponent, IntervalPickerComponent, DatePickerComponent, TimePickerComponent],
            imports: [ReactiveFormsModule, translateTestImport, NgbTooltipModule],
            providers: [ColumnManagerService, DatePickerManagerService],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [IntervalPickerComponent],
            },
        }).compileComponents();

        fixture = TestBed.createComponent(GridFilterCellComponent);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;
        translate = TestBed.get(TranslateService);
        translate.use('en');
        columnManager = TestBed.get(ColumnManagerService);
        columnManager.addColumn(new Column(Columns.ORIGIN, ColumnsTypes.TEXT, 'originText', 400,
            {
                filterable: true,
            }));
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
    });

    it('check is onFilter emit value', fakeAsync(function() {
        const testString: string = 'test';

        const subscription: Subscription = component.onFilter.subscribe((value) => {
            expect(value.column).toBe('originText');
            expect(value.filter).toBe(testString);
        });

        const input = fixtureDebug.query(By.css('input')).nativeElement;
        input.value = testString;
        input.dispatchEvent(new Event('input', {
            bubbles: true,
        }));
        tick(500);
        subscription.unsubscribe();
    }));

    it('check is date picker open/close', function() {
        component.index = 1;
        component.column = columnManager.getColumns()[1];
        fixture.detectChanges();
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
        component.index = 1;
        component.column = columnManager.getColumns()[1];
        fixture.detectChanges();
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
