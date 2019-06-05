import {FormsModule} from '@angular/forms';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StringList} from './stringList.component';
import {NumbersPipe} from 'app/pipes/numbers.pipe';
import {translateTestImport} from 'tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {StatusComponent} from '../status/status.component';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {StringsService} from '../../services/strings.service';
import {StringListItem} from './models/StringListItem';

describe('item list', function () {
    let component: StringList;
    let fixture: ComponentFixture<StringList>;
    let translate: TranslateService;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, translateTestImport, NgbTooltipModule],
            declarations: [StringList, NumbersPipe, StatusComponent],
            providers: [StringsService]
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en')
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
            component.stringListItems = [new StringListItem('t1e2s3t4')];
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('li span').innerText).toBe(resultString);
        });

        it('check items deleting', function () {
            let resultString: string = '12345';
            component.stringListItems = [new StringListItem(resultString)];
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
            component.stringListItems = [new StringListItem('test')];
                fixture.detectChanges();
            let firstElement = fixture.nativeElement.querySelector('li:first-of-type span');

            expect(firstElement.innerText).toBe(english.MESSAGE);

            translate.use('ru');
            fixture.detectChanges();

            expect(firstElement.innerText).toBe(russian.MESSAGE);
        });

        it('check deleteItem button localization', function () {
            component.stringListItems = [new StringListItem('test')];
            fixture.detectChanges();
            let delButton = fixture.nativeElement.querySelector('li:first-of-type button');

            expect(delButton.innerText).toBe(english.BUTTON_DELETE);

            translate.use('ru');
            fixture.detectChanges();

            expect(delButton.innerText).toBe(russian.BUTTON_DELETE);
        });
    });
});


