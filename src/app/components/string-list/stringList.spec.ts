import {FormsModule} from '@angular/forms';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {StringList} from './stringList.component';
import {NumbersPipe} from 'app/pipes/numbers/numbers.pipe';
import {translateTestImport} from 'tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {StatusComponent} from '../status/status.component';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {StringsService} from '../../services/strings/strings.service';
import {StringListItem} from './models/StringListItem';
import {ChangeDetectionStrategy} from '@angular/core';
import {ColorsPipe} from '../../pipes/colors/colors.pipe';
import {StringsFilterService} from "../../services/strings-filter/stringsFilter.service";
import {Statuses} from "../status/statuses";
import {now} from 'lodash';
import {StringsHttpService} from "../../services/getStrings/stringsHttp.service";
import {HttpClientModule} from "@angular/common/http";
import {StringFilterPipe} from "../../pipes/stringFilter/stringFilter.pipe";

describe('item list', function () {
    let component: StringList;
    let fixture: ComponentFixture<StringList>;
    let translate: TranslateService;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, translateTestImport, NgbTooltipModule, HttpClientModule],
            declarations: [StringList, NumbersPipe, StatusComponent, ColorsPipe, StringFilterPipe],
            providers: [StringsService, StringsFilterService, StringsHttpService]
        }).overrideComponent(StringList, {
            set: {changeDetection: ChangeDetectionStrategy.Default}
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');
        fixture = TestBed.createComponent(StringList);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
        translate = null;
    });

    describe('component', function () {

        it('check item with numbers', function () {
            let resultString: string = '1234';

            component.stringListItems = [new StringListItem('t1e2s3t4', now(), Statuses.FRESH)];
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('li span').innerText).toBe(resultString);
        });

        it('check items deleting', function () {
            let resultString: string = '12345';
            component.stringListItems = [new StringListItem(resultString, now(), Statuses.FRESH)];
            fixture.detectChanges();
            let firstElement = fixture.nativeElement.querySelector('li:first-of-type');

            expect(firstElement.querySelector('span').innerText).toBe(resultString);

            firstElement.querySelector('button')
                .dispatchEvent(new Event('click'));

            component.stringListItems.splice(0, 1);
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('li:first-of-type span')).toBe(null);
        });

        it('check item without numbers', function () {
            component.stringListItems = [new StringListItem('test', now(), Statuses.FRESH)];
            fixture.detectChanges();
            let firstElement = fixture.nativeElement.querySelector('li:first-of-type span');

            expect(firstElement.innerText).toBe(english.MESSAGE);

            translate.use('ru');
            fixture.detectChanges();

            expect(firstElement.innerText).toBe(russian.MESSAGE);
        });

        it('check deleteItem button localization', function () {
            component.stringListItems = [new StringListItem("test", now(), Statuses.FRESH)];
            fixture.detectChanges();
            let delButton = fixture.nativeElement.querySelector('li:first-of-type button');

            expect(delButton.innerText).toBe(english.BUTTON_DELETE);

            translate.use('ru');
            fixture.detectChanges();

            expect(delButton.innerText).toBe(russian.BUTTON_DELETE);
        });

        it('check is status change over time', fakeAsync(function () {
            let listItem: StringListItem = new StringListItem('test', now(), Statuses.FRESH);
            component.stringListItems = [listItem];
            let interval = component.countdown();
            fixture.detectChanges();
            let status = fixture.nativeElement.querySelector('status>div');

            expect(status.style.backgroundColor).toBe('green');

            tick(31000);
            fixture.detectChanges();

            expect(status.style.backgroundColor).toBe('yellow');

            tick(31000);
            fixture.detectChanges();

            expect(status.style.backgroundColor).toBe('red');

            clearInterval(interval);
        }));

        it('check filter', fakeAsync(function () {
            let testListItem1: StringListItem = new StringListItem('test1', now(), Statuses.FRESH);
            let testListItem2: StringListItem = new StringListItem('test2', now(), Statuses.FRESH);

            let count: number = component.countdown()
            component.stringListItems = [testListItem1];
            fixture.detectChanges();
            tick(31000);
            component.stringListItems.push(testListItem2);
            fixture.detectChanges();
            component.filterParams = {text: "1", status: Statuses.YESTERDAY};
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('li>span').innerText).toBe("1");

            component.filterParams = {text: "2", status: Statuses.FRESH};
            fixture.detectChanges();
            clearInterval(count);

            expect(fixture.nativeElement.querySelector('li>span').innerText).toBe("2");
        }));
    });
});


