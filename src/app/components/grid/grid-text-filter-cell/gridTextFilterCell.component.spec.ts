import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {GridTextFilterCellComponent} from 'app/components/grid/grid-text-filter-cell/gridTextFilterCell.component';
import {Columns} from 'app/enums/columns.enum';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {Subscription} from 'rxjs';
import {translateTestImport} from 'tests/testTranslationConfig';

describe('text filter cell component', function() {
    let component: GridTextFilterCellComponent;
    let fixture: ComponentFixture<GridTextFilterCellComponent>;
    let fixtureDebug: DebugElement;
    let columnManager: ColumnManagerService;
    let translate: TranslateService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridTextFilterCellComponent],
            imports: [ReactiveFormsModule, translateTestImport, NgbTooltipModule],
            providers: [ColumnManagerService],
        }).compileComponents();

        fixture = TestBed.createComponent(GridTextFilterCellComponent);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;
        translate = TestBed.get(TranslateService);
        translate.use('en');
        columnManager = TestBed.get(ColumnManagerService);
        columnManager.addColumn(new Column(Columns.ORIGIN, ColumnsTypes.TEXT, 'originText', 400,
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

    it('check is onFilter emit value', function() {
        const testString: string = 'test';
        const subscription: Subscription = component.onFilter.subscribe((value) => {
            expect(value.column).toBe('originText');
            expect(value.filter).toBe(testString);
        });

        const input = fixtureDebug.query(By.css('input')).nativeElement;
        input.value = testString;
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new KeyboardEvent('keypress', {
            bubbles: true,
            cancelable: true,
            code: 'Enter',
            key: 'Enter',
        }));
        fixture.detectChanges();
        subscription.unsubscribe();
    });
});
