import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TextGridCellComponent} from 'app/components/grid/text-grid-cell/textGridCell.component';
import {StringGridItem} from 'app/components/string-add/models/StringGridItem';
import {Columns} from 'app/enums/columns.enum';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {Statuses} from 'app/enums/statuses.enum';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {translateTestImport} from 'tests/testTranslationConfig';

describe('grid cell', function() {
    let component: TextGridCellComponent;
    let fixture: ComponentFixture<TextGridCellComponent>;
    let columnManager: ColumnManagerService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [TextGridCellComponent],
            imports: [translateTestImport, NgbTooltipModule],
            providers: [ColumnManagerService],
        }).compileComponents();

        fixture = TestBed.createComponent(TextGridCellComponent);
        columnManager = TestBed.get(ColumnManagerService);
        columnManager.addColumn(new Column(Columns.ORIGIN, ColumnsTypes.TEXT, 'originText', 400,
            {
                sortable: true,
                resizable: true,
            }));
        columnManager.addColumn(new Column(Columns.ORIGIN, ColumnsTypes.TEXT, 'originText', 400,
            {
                sortable: true,
                resizable: true,
            }));

        component = fixture.componentInstance;
        component.column = columnManager.getColumns()[0];
        component.item = new StringGridItem('test1', new Date(), Statuses.FRESH);
        component.index = 0;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        columnManager = null;
    });

    it('check resizing', function() {
        columnManager.getColumns()[0].width = 500;
        columnManager.changeBodyWidth();
        expect(fixture.nativeElement.parentNode.style.width).toBe('500px');
    });

    it('check dragging', function() {
        expect(fixture.nativeElement.parentNode.style.gridColumn).toBe('1 / auto');
        columnManager.columnDragStart(0);
        columnManager.columnDragEnd(1);
        expect(fixture.nativeElement.parentNode.style.gridColumn).toBe('2 / auto');
    });
});
