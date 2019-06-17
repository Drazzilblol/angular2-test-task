import {HttpClientModule} from '@angular/common/http';
import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {now} from 'lodash';
import {translateTestImport} from 'tests/testTranslationConfig';
import {Statuses} from '../../enums/statuses.enum';
import {ColorsPipe} from '../../pipes/colors/colors.pipe';
import {StringFilterPipe} from '../../pipes/stringFilter/stringFilter.pipe';
import {StringsHttpService} from '../../services/getStrings/stringsHttp.service';
import {StringsFilterService} from '../../services/strings-filter/stringsFilter.service';
import {StringsService} from '../../services/strings/strings.service';
import {StatusComponent} from '../status/status.component';
import {StringListItem} from './models/StringListItem';
import {StringList} from './stringList.component';

describe('item list', function() {
    let component: StringList;
    let fixture: ComponentFixture<StringList>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [StringList, StatusComponent, ColorsPipe, StringFilterPipe],
            imports: [FormsModule, translateTestImport, NgbTooltipModule, HttpClientModule],
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

            component.stringListItems = [new StringListItem('t1e2s3t4', now(), Statuses.FRESH)];
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('li span')).nativeElement.innerText).toBe(resultString);
        });

        it('check items deleting', function() {
            const resultString: string = '12345';
            component.stringListItems = [new StringListItem(resultString, now(), Statuses.FRESH)];
            fixture.detectChanges();
            const firstElement = fixtureDebug.query(By.css('li:first-of-type')).nativeElement;

            expect(firstElement.querySelector('span').innerText).toBe(resultString);

            firstElement.querySelector('button')
                .dispatchEvent(new Event('click'));

            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('li:first-of-type span'))).toBe(null);
        });

        it('check item without numbers', function() {
            component.stringListItems = [new StringListItem('test', now(), Statuses.FRESH)];
            fixture.detectChanges();
            const firstElement = fixtureDebug.query(By.css('li:first-of-type span')).nativeElement;

            expect(firstElement.innerText).toBe(english.MESSAGE);

            translate.use('ru');
            fixture.detectChanges();

            expect(firstElement.innerText).toBe(russian.MESSAGE);
        });

        it('check is status change over time', fakeAsync(function() {
            const listItem: StringListItem = new StringListItem('test', now(), Statuses.FRESH);
            component.stringListItems = [listItem];
            component.countdown();
            fixture.detectChanges();
            const status = fixtureDebug.query(By.css('status>div'));

            expect(status.styles['background-color']).toBe('green');

            tick(31000);
            fixture.detectChanges();

            expect(status.styles['background-color']).toBe('yellow');

            tick(31000);
            fixture.detectChanges();

            expect(status.styles['background-color']).toBe('red');

            clearInterval(component.interval);
        }));

        it('check filter', fakeAsync(function() {
            const testListItem1: StringListItem = new StringListItem('test1', now(), Statuses.FRESH);
            const testListItem2: StringListItem = new StringListItem('test2', now(), Statuses.FRESH);

            component.stringListItems = [testListItem1];
            component.countdown();
            fixture.detectChanges();
            tick(31000);
            component.stringListItems.push(testListItem2);
            component.filterParams = {text: '1', status: Statuses.YESTERDAY};
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('li>span')).nativeElement.innerText).toBe('1');

            component.filterParams = {text: '2', status: Statuses.FRESH};
            fixture.detectChanges();
            clearInterval(component.interval);

            expect(fixtureDebug.query(By.css('li>span')).nativeElement.innerText).toBe('2');
        }));


        it('check items refresh', fakeAsync(function() {
            const resultString: string = '12345';
            component.stringListItems = [new StringListItem(resultString, now(), Statuses.FRESH)];
            component.countdown();
            tick(31000);
            fixture.detectChanges();

            expect(fixtureDebug.query(By.css('li:first-of-type div')).styles['background-color']).toBe('yellow');

            fixtureDebug.query(By.css('li:first-of-type button:last-of-type')).nativeElement
                .dispatchEvent(new Event('click'));

            fixture.detectChanges();

            clearInterval(component.interval);
            expect(fixtureDebug.query(By.css('li:first-of-type div')).styles['background-color']).toBe('green');
        }));
    });
});
