import {HttpClientModule} from '@angular/common/http';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {DateGridCellComponent} from 'app/components/grid/date-grid-cell/dateGridCell.component';
import {GridDateFilterCellComponent} from 'app/components/grid/grid-date-filter-cell/gridDateFilterCell.component';
import {GridTextFilterCellComponent} from 'app/components/grid/grid-text-filter-cell/gridTextFilterCell.component';
import {StatusGridCellComponent} from 'app/components/grid/status-grid-cell/statusGridCell.component';
import {TextGridCellComponent} from 'app/components/grid/text-grid-cell/textGridCell.component';
import {DraggableDirective} from 'app/directives/draggable/draggable.directive';
import {ResizableDirective} from 'app/directives/resizable/resizable.directive';
import {Columns} from 'app/enums/columns.enum';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {Statuses} from 'app/enums/statuses.enum';
import {PipesModule} from 'app/pipes/pipes.module';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {DatePickerManagerService} from 'app/services/date-picker-manager/datePickerManager.service';
import {FilterParamsService} from 'app/services/filter-params/filterParams.service';
import {FilterService} from 'app/services/filter/filter.service';
import {NgxMaskModule} from 'ngx-mask';
import {translateTestImport} from 'tests/testTranslationConfig';
import {GridHeaderCellComponent} from '../grid-header-cell/gridHeaderCell.component';
import {StringGridItem} from '../models/StringGridItem';
import {GridComponent} from './grid.component';
import {SortParams} from './models/SortParams';

describe('grid', function() {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;
    let columnsManager: ColumnManagerService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridComponent, GridHeaderCellComponent, DraggableDirective, TextGridCellComponent,
                DateGridCellComponent, StatusGridCellComponent, ResizableDirective, GridTextFilterCellComponent,
                GridDateFilterCellComponent],
            imports: [translateTestImport, NgbTooltipModule, HttpClientModule, PipesModule, ReactiveFormsModule,
                NgxMaskModule.forRoot()],
            providers: [FilterParamsService, FilterService, ColumnManagerService, DatePickerManagerService],
        }).overrideComponent(GridComponent, {
            set: {changeDetection: ChangeDetectionStrategy.Default},
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        columnsManager = TestBed.get(ColumnManagerService);
        translate.use('en');
        fixture = TestBed.createComponent(GridComponent);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;

        component.columns = columnsManager.addColumns([
            new Column(Columns.ORIGIN, ColumnsTypes.TEXT, 'originText', 280,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    filterable: true,
                }),
            new Column(Columns.ORIGIN, ColumnsTypes.TEXT, 'originText', 280,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    filterable: true,
                }),
        ]);

        component.options = {
            trackByFunction(index: number, item: StringGridItem): any {
                return item.id + item.status;
            },
            defaultSort: Columns.DATE,
        };
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        translate = null;
        fixtureDebug = null;
        columnsManager = null;
    });

    describe('component', function() {
        it('check filter', function() {
            const testListItem1: StringGridItem = new StringGridItem('test1', new Date(), Statuses.YESTERDAY);
            const testListItem2: StringGridItem = new StringGridItem('test2', new Date(), Statuses.FRESH);
            component.items = [testListItem1, testListItem2];
            fixture.detectChanges();
            const input = fixtureDebug.queryAll(By.css('grid-text-filter-cell .filter-input'))[0].nativeElement;
            input.value = 'test1';
            input.dispatchEvent(new Event('input'));
            input.dispatchEvent(new KeyboardEvent('keypress', {
                bubbles: true,
                cancelable: true,
                code: 'Enter',
                key: 'Enter',
            }));
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('text-grid-cell .content')).nativeElement.innerText).toBe('test1');

            input.value = 'test2';
            input.dispatchEvent(new Event('input'));
            input.dispatchEvent(new KeyboardEvent('keypress', {
                bubbles: true,
                cancelable: true,
                code: 'Enter',
                key: 'Enter',
            }));
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('text-grid-cell .content')).nativeElement.innerText).toBe('test2');
        });

        it('check sorting', function() {
            const testListItem1: StringGridItem = new StringGridItem('test1', new Date(), Statuses.FRESH);
            const testListItem2: StringGridItem = new StringGridItem('test2', new Date(), Statuses.FRESH);

            component.filteredItems = [testListItem2, testListItem1];
            component.sort(new SortParams(Sort.ORIGIN, Order.ASC));
            fixture.detectChanges();
            let row = fixtureDebug.queryAll(By.css('.hoverable-row'));

            expect(row[0].query(By.css('.content')).nativeElement.innerText)
                .toBe('test1');
            expect(row[1].query(By.css('.content')).nativeElement.innerText)
                .toBe('test2');

            component.sort(new SortParams(Sort.ORIGIN, Order.DESC));

            fixture.detectChanges();
            row = fixtureDebug.queryAll(By.css('.hoverable-row'));

            expect(row[0].query(By.css('.content')).nativeElement.innerText)
                .toBe('test2');
            expect(row[1].query(By.css('.content')).nativeElement.innerText)
                .toBe('test1');
        });

        it('check dragging', fakeAsync(function() {
            const testElem1 = fixture.debugElement.queryAll(By.css('grid-header-cell .content'))[0].nativeElement;
            const testElem2 = fixture.debugElement.queryAll(By.css('grid-header-cell .content'))[1].nativeElement;
            testElem1.dispatchEvent(new MouseEvent('mousedown', {
                bubbles: true,
                clientX: testElem1.getBoundingClientRect().x,
            }));
            tick(1000);

            expect(testElem1.classList.contains('draggable')).toBe(true);

            testElem2.dispatchEvent(new MouseEvent('mouseup', {
                bubbles: true,
            }));
            fixture.detectChanges();

            expect(testElem1.classList.contains('draggable')).toBe(false);
            expect(fixture.debugElement.queryAll(By.css('grid-header-cell'))[1]
                .nativeElement.parentNode.style.gridColumn)
                .toBe('2 / auto');
        }));
    });
});
