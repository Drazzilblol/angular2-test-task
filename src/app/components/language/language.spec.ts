import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Language} from './language.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageDialog} from './dialog/languageDialog.component';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {translateTestImport} from 'tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';

describe('language', function () {
    let component: Language;
    let fixture: ComponentFixture<Language>;
    let translate: TranslateService;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, translateTestImport, NgbModalModule],
            declarations: [Language, LanguageDialog],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [LanguageDialog],
            }
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');

        fixture = TestBed.createComponent(Language);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
        translate = null;
    });

    describe('component', function () {
        it('check dialog open/close', function () {
            let langButton = fixture.nativeElement.querySelector('button');
            langButton.dispatchEvent(new Event('click'));
            fixture.detectChanges();

            expect(document.querySelector('.modal-content')).not.toBe(null);

            document.querySelector('.btn-secondary').dispatchEvent(new Event('click'));

            expect(document.querySelector('.modal-content')).toBe(null);
        });
    });
});



