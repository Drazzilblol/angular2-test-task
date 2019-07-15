import {HttpClientModule} from '@angular/common/http';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {DraggableDirective} from 'app/directives/draggable/draggable.directive';
import {ResizableDirective} from 'app/directives/resizable/resizable.directive';
import {Columns} from 'app/enums/columns.enum';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {Statuses} from 'app/enums/statuses.enum';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {PipesModule} from 'app/pipes/pipes.module';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {FilterService} from 'app/services/strings-filter/filter.service';
import {now} from 'lodash';
import {translateTestImport} from 'tests/testTranslationConfig';
import {GridCellComponent} from '../grid-cell/gridCell.component';
import {GridHeaderCellComponent} from '../header-grid-cell/gridHeaderCell.component';
import {StringListItem} from '../string-add/models/StringListItem';
import {GridComponent} from './grid.component';
import {SortParams} from './models/SortParams';

describe('item list', function() {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;
    let columnsManager: ColumnManagerService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridComponent, GridCellComponent, GridHeaderCellComponent, DraggableDirective,
                ResizableDirective],
            imports: [translateTestImport, NgbTooltipModule, HttpClientModule, PipesModule],
            providers: [FilterService, ColumnManagerService],
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
            new Column(Columns.STATUS, '', 'status', 24),
            new Column(Columns.TRANSFORMED, Columns.TRANSFORMED, 'transformedText',
                280, {
                    sortable: true,
                    resizable: true,
                }),
            new Column(Columns.ORIGIN, Columns.ORIGIN, 'originText', 280,
                {
                    sortable: true,
                    resizable: true,
                }),
            new Column(Columns.DATE, Columns.DATE, 'parsedDate', 216,
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

            component.items = [new StringListItem('t1e2s3t4', new Date(now()), Statuses.FRESH)];
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('grid-cell .content')).nativeElement.innerText).toBe(resultString);
        });

        it('check item without numbers', function() {
            component.items = [new StringListItem('test', new Date(now()), Statuses.FRESH)];
            fixture.detectChanges();
            const firstElement = fixtureDebug.query(By.css('grid-cell .content')).nativeElement;

            expect(firstElement.innerText).toBe(english.MESSAGE);

            translate.use('ru');
            fixture.detectChanges();

            expect(firstElement.innerText).toBe(russian.MESSAGE);
        });

        it('check filter', fakeAsync(function() {
            const testListItem1: StringListItem = new StringListItem('test1', new Date(now()), Statuses.YESTERDAY);
            const testListItem2: StringListItem = new StringListItem('test2', new Date(now()), Statuses.FRESH);

            component.items = [testListItem1];
            fixture.detectChanges();
            component.items.push(testListItem2);
            component.filterParams = {text: '1', status: Statuses.YESTERDAY};
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('grid-cell .content')).nativeElement.innerText).toBe('1');

            component.filterParams = {text: '2', status: Statuses.FRESH};
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('grid-cell .content')).nativeElement.innerText).toBe('2');
        }));

        it('check sorting', function() {
            const testListItem1: StringListItem = new StringListItem('test1', new Date(now()), Statuses.FRESH);
            const testListItem2: StringListItem = new StringListItem('test2', new Date(now()), Statuses.FRESH);

            component.items = [testListItem2, testListItem1];
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
    });
});
