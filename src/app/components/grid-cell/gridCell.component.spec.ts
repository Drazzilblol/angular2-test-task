import {ChangeDetectionStrategy} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {GridComponent} from 'app/components/grid/grid.component';
import {Columns} from 'app/enums/columns.enum';
import {Column} from 'app/services/column-manger-service/column';
import {translateTestImport} from 'tests/testTranslationConfig';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {GridCellComponent} from './gridCell.component';

describe('grid cell', function() {
    let component: GridCellComponent;
    let fixture: ComponentFixture<GridCellComponent>;
    let columnManager: ColumnManagerService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridCellComponent],
            imports: [translateTestImport],
            providers: [ColumnManagerService],
        }).compileComponents();

        fixture = TestBed.createComponent(GridCellComponent);
        columnManager = TestBed.get(ColumnManagerService);
        columnManager.addColumn(new Column(Columns.ORIGIN, 'test1', 400,
            {
                sortable: true,
                resizable: true,
            }));
        columnManager.addColumn(new Column(Columns.ORIGIN, 'test2', 400,
            {
                sortable: true,
                resizable: true,
            }));

        component = fixture.componentInstance;
        component.column = columnManager.getColumns()[0];
        component.item = {test1: 'test'};
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
