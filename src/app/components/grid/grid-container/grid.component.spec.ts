import {HttpClientModule} from '@angular/common/http';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {GridFilterCellComponent} from 'app/components/grid/grid-filter-cell/gridFilterCell.component';
import {DraggableDirective} from 'app/directives/draggable/draggable.directive';
import {ResizableDirective} from 'app/directives/resizable/resizable.directive';
import {Columns} from 'app/enums/columns.enum';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {Statuses} from 'app/enums/statuses.enum';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {PipesModule} from 'app/pipes/pipes.module';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {DatePickerManagerService} from 'app/services/date-picker-manager/datePickerManager.service';
import {FilterParamsService} from 'app/services/filter-params/filterParams.service';
import {FilterService} from 'app/services/filter/filter.service';
import {translateTestImport} from 'tests/testTranslationConfig';
import {StringGridItem} from '../../string-add/models/StringGridItem';
import {GridCellComponent} from '../grid-cell/gridCell.component';
import {GridHeaderCellComponent} from '../grid-header-cell/gridHeaderCell.component';
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
            declarations: [GridComponent, GridCellComponent, GridHeaderCellComponent, DraggableDirective,
                ResizableDirective, GridFilterCellComponent],
            imports: [translateTestImport, NgbTooltipModule, HttpClientModule, PipesModule, ReactiveFormsModule],
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
            new Column('', ColumnsTypes.STATUS, 'status', 24),
            new Column(Columns.TRANSFORMED, ColumnsTypes.TEXT, 'transformedText',
                280, {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                }),
            new Column(Columns.ORIGIN, ColumnsTypes.TEXT, 'originText', 280,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                }),
            new Column(Columns.DATE, ColumnsTypes.DATE, 'parsedDate', 216,
                {
                    sortable: true,
                    defaultSort: true,
                }),
        ]);
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

        it('check item with numbers', function() {
            const resultString: string = '1234';

            component.filteredItems = [new StringGridItem('t1e2s3t4', new Date(), Statuses.FRESH)];
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('grid-cell .content')).nativeElement.innerText).toBe(resultString);
        });

        it('check item without numbers', function() {
            component.filteredItems = [new StringGridItem('test', new Date(), Statuses.FRESH)];
            fixture.detectChanges();
            const firstElement = fixtureDebug.query(By.css('grid-cell .content')).nativeElement;

            expect(firstElement.innerText).toBe(english.MESSAGE);

            translate.use('ru');
            fixture.detectChanges();

            expect(firstElement.innerText).toBe(russian.MESSAGE);
        });

        it('check filter-params', fakeAsync(function() {
            const testListItem1: StringGridItem = new StringGridItem('test1', new Date(), Statuses.YESTERDAY);
            const testListItem2: StringGridItem = new StringGridItem('test2', new Date(), Statuses.FRESH);

            component.items = [testListItem1, testListItem2];
            fixture.detectChanges();
            component.filter({column: 'transformedText', filter: '1'});
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('grid-cell .content')).nativeElement.innerText).toBe('1');

            component.filter({column: 'transformedText', filter: '2'});
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('grid-cell .content')).nativeElement.innerText).toBe('2');
        }));

        it('check sorting', function() {
            const testListItem1: StringGridItem = new StringGridItem('test1', new Date(), Statuses.FRESH);
            const testListItem2: StringGridItem = new StringGridItem('test2', new Date(), Statuses.FRESH);

            component.filteredItems = [testListItem2, testListItem1];
            component.sort(new SortParams(Sort.TRANSFORMED, Order.ASC));
            fixture.detectChanges();
            let row = fixtureDebug.queryAll(By.css('.hoverable-row'));

            expect(row[0].query(By.css('.content')).nativeElement.innerText)
                .toBe('1');
            expect(row[1].query(By.css('.content')).nativeElement.innerText)
                .toBe('2');

            component.sort(new SortParams(Sort.TRANSFORMED, Order.DESC));
            fixture.detectChanges();
            row = fixtureDebug.queryAll(By.css('.hoverable-row'));

            expect(row[0].query(By.css('.content')).nativeElement.innerText)
                .toBe('2');
            expect(row[1].query(By.css('.content')).nativeElement.innerText)
                .toBe('1');
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
                .toBe('3 / auto');
        }));
    });
});
