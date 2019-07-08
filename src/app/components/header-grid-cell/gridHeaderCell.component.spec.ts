import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {translateTestImport} from 'tests/testTranslationConfig';
import {Columns} from '../../enums/columns.enum';
import {Column} from '../../services/column-manger-service/column';
import {ColumnManagerService} from '../../services/column-manger-service/columnManager.service';
import {GridHeaderCellComponent} from './gridHeaderCell.component';

describe('grid header cell', function() {
    let component: GridHeaderCellComponent;
    let fixture: ComponentFixture<GridHeaderCellComponent>;
    let columnManager: ColumnManagerService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridHeaderCellComponent],
            imports: [translateTestImport],
            providers: [ColumnManagerService],
        }).compileComponents();

        fixture = TestBed.createComponent(GridHeaderCellComponent);
        fixtureDebug = fixture.debugElement;
        columnManager = TestBed.get(ColumnManagerService);
        columnManager.addColumn(new Column(Columns.ORIGIN, Columns.ORIGIN, 'test1', 400,
            {
                sortable: true,
                resizable: true,
            }));
        columnManager.addColumn(new Column(Columns.ORIGIN, Columns.ORIGIN, 'test2', 400,
            {
                sortable: true,
                resizable: false,
            }));

        component = fixture.componentInstance;
        component.column = columnManager.getColumns()[0];
        component.index = 0;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        columnManager = null;
        fixtureDebug = null;
    });

    it('check resizing', function() {
        const resizer = fixtureDebug.queryAll(By.css('.ui-column-resizer'))[0].nativeElement;
        resizer.dispatchEvent(new MouseEvent('mousedown'));
        const event = new MouseEvent('mousemove', {
            bubbles: true,
            clientX: 100,
        });
        resizer.dispatchEvent(event);
        resizer.dispatchEvent(new MouseEvent('mouseup'));

        expect(fixture.nativeElement.style.width).toBe('500px');
    });
});
