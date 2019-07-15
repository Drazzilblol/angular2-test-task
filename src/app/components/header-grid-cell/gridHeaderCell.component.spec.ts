import {DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DraggableDirective} from 'app/directives/draggable/draggable.directive';
import {ResizableDirective} from 'app/directives/resizable/resizable.directive';
import {Columns} from 'app/enums/columns.enum';
import {Order} from 'app/enums/order.enum';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {translateTestImport} from 'tests/testTranslationConfig';
import {SortParams} from '../grid/models/SortParams';
import {GridHeaderCellComponent} from './gridHeaderCell.component';

describe('grid header cell', function() {
    let component: GridHeaderCellComponent;
    let fixture: ComponentFixture<GridHeaderCellComponent>;
    let columnManager: ColumnManagerService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridHeaderCellComponent, DraggableDirective, ResizableDirective],
            imports: [translateTestImport, NgbTooltipModule],
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
                resizable: true,
            }));

        component = fixture.componentInstance;
        component.index = 0;
        component.column = columnManager.getColumns()[0];
        component.currentSort = new SortParams(component.column.dataFieldName, Order.ASC);
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        columnManager = null;
        fixtureDebug = null;
    });

    it('check resizing', function() {
        const element = fixtureDebug.queryAll(By.css('div>div'))[0].nativeElement;
        element.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            clientX: 400,
            clientY: 20,
        }));
        const event = new MouseEvent('mousemove', {
            bubbles: true,
            clientX: 500,
        });
        element.dispatchEvent(event);
        element.dispatchEvent(new MouseEvent('mouseup'));

        expect(fixture.nativeElement.parentNode.style.width).toBe('500px');
    });

    it('check is onSort output emmit value', fakeAsync(function() {
        component.onSort.subscribe((params) => {
            expect(params.column).toBe('test1');
            expect(params.order).toBe(Order.DESC);
        });
        fixtureDebug.query(By.css('.content')).nativeElement
            .dispatchEvent(new Event('click'));
        tick(50);
    }));
});
