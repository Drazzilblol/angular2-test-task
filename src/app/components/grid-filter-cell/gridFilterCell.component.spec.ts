import {DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {GridFilterCellComponent} from 'app/components/grid-filter-cell/gridFilterCell.component';
import {Columns} from 'app/enums/columns.enum';
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

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridFilterCellComponent],
            imports: [ReactiveFormsModule, translateTestImport],
            providers: [ColumnManagerService, DatePickerManagerService],
        }).compileComponents();

        fixture = TestBed.createComponent(GridFilterCellComponent);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;
        columnManager = TestBed.get(ColumnManagerService);
        columnManager.addColumn(new Column(Columns.ORIGIN, 'originText', 400,
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
            expect(value.text).toBe(testString);
        });

        const input = fixtureDebug.query(By.css('input')).nativeElement;
        input.value = testString;
        input.dispatchEvent(new Event('input', {
            bubbles: true,
        }));
        tick(500);
        subscription.unsubscribe();
    }));

});
