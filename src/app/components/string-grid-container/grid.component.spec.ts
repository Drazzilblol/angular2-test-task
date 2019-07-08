import {HttpClientModule} from '@angular/common/http';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {Columns} from 'app/enums/columns.enum';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {Statuses} from 'app/enums/statuses.enum';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {PipesModule} from 'app/pipes/pipes.module';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {StringsHttpService} from 'app/services/getStrings/stringsHttp.service';
import {FilterService} from 'app/services/strings-filter/filter.service';
import {GridAddService} from 'app/services/strings/grid-add.service';
import {now} from 'lodash';
import {translateTestImport} from 'tests/testTranslationConfig';
import {GridHeaderCellComponent} from '../header-grid-cell/gridHeaderCell.component';
import {GridCellComponent} from '../string-grid-cell/gridCell.component';
import {GridHeaderComponent} from '../string-grid-header/gridHeader.component';
import {SortParams} from '../string-grid-header/models/SortParams';
import {GridRowComponent} from '../string-grid-row/gridRow.component';
import {GridComponent} from './grid.component';
import {StringListItem} from './models/StringListItem';

describe('item list', function() {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;
    let columnsManager: ColumnManagerService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridComponent, GridHeaderComponent, GridRowComponent,
                GridCellComponent, GridHeaderCellComponent],
            imports: [translateTestImport, NgbTooltipModule, HttpClientModule, PipesModule],
            providers: [GridAddService, FilterService, StringsHttpService, ColumnManagerService],
        }).overrideComponent(GridComponent, {
            set: {changeDetection: ChangeDetectionStrategy.Default},
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        columnsManager = TestBed.get(ColumnManagerService);
        translate.use('en');
        fixture = TestBed.createComponent(GridComponent);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;

        columnsManager.addColumn(new Column(Columns.STATUS, '', 'status', 24, {
            sortable: false,
            resizable: false,
        }));
        columnsManager.addColumn(new Column(Columns.TRANSFORMED, Columns.TRANSFORMED, 'transformedText',
            280, {
                sortable: true,
                resizable: true,
            }));
        columnsManager.addColumn(new Column(Columns.ORIGIN, Columns.ORIGIN, 'originText', 280,
            {
                sortable: true,
                resizable: true,
            }));
        columnsManager.addColumn(new Column(Columns.DATE, Columns.DATE, 'parsedDate', 216,
            {
                sortable: true,
                resizable: false,
                defaultSort: true,
            }));
        component.columns = columnsManager.getColumns();
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        translate = null;
        fixtureDebug = null;
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

        it('check is status change over time', fakeAsync(function() {
            const listItem: StringListItem = new StringListItem('test', new Date(now()), Statuses.FRESH);
            component.items = [listItem];
            component.countdown();
            fixture.detectChanges();
            const status = fixtureDebug.query(By.css('.status'));

            expect(status.classes['status-green']).toBe(true);

            tick(31000);
            fixture.detectChanges();

            expect(status.classes['status-yellow']).toBe(true);

            tick(31000);
            fixture.detectChanges();

            expect(status.classes['status-red']).toBe(true);
        }));

        it('check filter', fakeAsync(function() {
            const testListItem1: StringListItem = new StringListItem('test1', new Date(now()), Statuses.FRESH);
            const testListItem2: StringListItem = new StringListItem('test2', new Date(now()), Statuses.FRESH);

            component.items = [testListItem1];
            component.countdown();
            fixture.detectChanges();
            tick(31000);
            component.items.push(testListItem2);
            component.filterParams = {text: '1', status: Statuses.YESTERDAY};
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('grid-cell .content')).nativeElement.innerText).toBe('1');

            component.filterParams = {text: '2', status: Statuses.FRESH};
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('grid-cell .content')).nativeElement.innerText).toBe('2');
            component.intervalSub.unsubscribe();
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
