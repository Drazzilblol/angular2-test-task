import {FormsModule} from '@angular/forms';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StringList} from './stringList.component';
import {NumbersPipe} from 'app/pipes/numbers.pipe';
import {translateTestImport} from 'tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {StatusComponent} from '../status/status.component';
import {NgbModule, NgbTooltip, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

describe('string list', function () {
    let component: StringList;
    let fixture: ComponentFixture<StringList>;
    let translate: TranslateService;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, translateTestImport, NgbTooltipModule],
            declarations: [StringList, NumbersPipe, StatusComponent],
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

        it('check string with numbers', function () {
            let testStrings = ['t1e2s3t4'];
            let resultString = '1234';
            component.strings = testStrings;
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('li span').innerText).toBe(resultString);
        });

        it('check items deleting', function () {
            let resultString = '12345';
            component.strings = [resultString];
            fixture.detectChanges();
            let firstElement = fixture.nativeElement.querySelector('li:first-of-type');

            expect(firstElement.querySelector('span').innerText).toBe(resultString);

            component.onDelete.subscribe(value => {
                expect(value).toEqual(0);
            });
            firstElement.querySelector('button')
                .dispatchEvent(new Event('click'));

            component.strings.splice(0, 1);
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('li:first-of-type span')).toBe(null);
        });

        it('check string without numbers', function () {
            component.strings = ['test'];
            fixture.detectChanges();
            let firstElement = fixture.nativeElement.querySelector('li:first-of-type span');

            expect(firstElement.innerText).toBe(english.MESSAGE);

            translate.use('ru');
            fixture.detectChanges();

            expect(firstElement.innerText).toBe(russian.MESSAGE);
        });

        it('check deleteItem button localization', function () {
            component.strings = ['test'];
            fixture.detectChanges();
            let delButton = fixture.nativeElement.querySelector('li:first-of-type button');

            expect(delButton.innerText).toBe(english.BUTTON_DELETE);

            translate.use('ru');
            fixture.detectChanges();

            expect(delButton.innerText).toBe(russian.BUTTON_DELETE);
        });
    });
});


