import {HttpClientModule} from '@angular/common/http';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {Statuses} from 'app/enums/statuses.enum';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {ColorsPipe} from 'app/pipes/colors/colors.pipe';
import {StringFilterPipe} from 'app/pipes/stringFilter/stringFilter.pipe';
import {StringsHttpService} from 'app/services/getStrings/stringsHttp.service';
import {StringsFilterService} from 'app/services/strings-filter/stringsFilter.service';
import {StringsService} from 'app/services/strings/strings.service';
import {now} from 'lodash';
import {translateTestImport} from 'tests/testTranslationConfig';
import {StatusComponent} from '../status/status.component';
import {StringsGridHeader} from '../string-grid-header/stringGridHeader.component';
import {StringListItem} from './models/StringListItem';
import {StringList} from './stringGridContainer.component';

describe('item list', function() {
    let component: StringList;
    let fixture: ComponentFixture<StringList>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [StringList, StatusComponent, ColorsPipe, StringFilterPipe, StringsGridHeader],
            imports: [translateTestImport, NgbTooltipModule, HttpClientModule],
            providers: [StringsService, StringsFilterService, StringsHttpService],
        }).overrideComponent(StringList, {
            set: {changeDetection: ChangeDetectionStrategy.Default},
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');
        fixture = TestBed.createComponent(StringList);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;
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

            component.stringListItems = [new StringListItem('t1e2s3t4', new Date(now()), Statuses.FRESH)];
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('.content')).nativeElement.innerText).toBe(resultString);
        });

        it('check item without numbers', function() {
            component.stringListItems = [new StringListItem('test', new Date(now()), Statuses.FRESH)];
            fixture.detectChanges();
            const firstElement = fixtureDebug.query(By.css('.content')).nativeElement;

            expect(firstElement.innerText).toBe(english.MESSAGE);

            translate.use('ru');
            fixture.detectChanges();

            expect(firstElement.innerText).toBe(russian.MESSAGE);
        });

        it('check is status change over time', fakeAsync(function() {
            const listItem: StringListItem = new StringListItem('test', new Date(now()), Statuses.FRESH);
            component.stringListItems = [listItem];
            component.countdown();
            fixture.detectChanges();
            const status = fixtureDebug.query(By.css('status>div'));

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

            component.stringListItems = [testListItem1];
            component.countdown();
            fixture.detectChanges();
            tick(31000);
            component.stringListItems.push(testListItem2);
            component.filterParams = {text: '1', status: Statuses.YESTERDAY};
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('.content')).nativeElement.innerText).toBe('1');

            component.filterParams = {text: '2', status: Statuses.FRESH};
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('.content')).nativeElement.innerText).toBe('2');
            component.intervalSub.unsubscribe();
        }));

        it('check sorting', function() {
            const testListItem1: StringListItem = new StringListItem('test1', new Date(now()), Statuses.FRESH);
            const testListItem2: StringListItem = new StringListItem('test2', new Date(now()), Statuses.FRESH);

            component.stringListItems = [testListItem2, testListItem1];
            //    component.sort(new SortParams(Sort.TRANSFORMED, Order.ASC));
            fixture.detectChanges();
            let row = fixtureDebug.queryAll(By.css('.hoverable-row'));

            expect(row[0].query(By.css('.content')).nativeElement.innerText)
                .toBe('1');
            expect(row[1].query(By.css('.content')).nativeElement.innerText)
                .toBe('2');

            //   component.sort(new SortParams(Sort.TRANSFORMED, Order.DESC));
            fixture.detectChanges();
            row = fixtureDebug.queryAll(By.css('.hoverable-row'));

            expect(row[0].query(By.css('.content')).nativeElement.innerText)
                .toBe('2');
            expect(row[1].query(By.css('.content')).nativeElement.innerText)
                .toBe('1');
        });
    });
});
