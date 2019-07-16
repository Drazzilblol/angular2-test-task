import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Columns} from 'app/enums/columns.enum';
import {Column} from 'app/services/column-manger-service/column';
import {translateTestImport} from 'tests/testTranslationConfig';
import {ColumnManagerService} from '../../services/column-manger-service/columnManager.service';
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
        columnManager.addColumn(new Column(Columns.ORIGIN, 'test', 400,
            {
                sortable: true,
                resizable: true,
            }));

        component = fixture.componentInstance;
        component.column = columnManager.getColumns()[0];
        component.item = {test: 'test'};
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
});
