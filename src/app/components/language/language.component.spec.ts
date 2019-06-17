import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {translateTestImport} from 'tests/testTranslationConfig';
import {LanguageDialog} from './dialog/languageDialog.component';
import {Language} from './language.component';

describe('language', function() {
    let component: Language;
    let fixture: ComponentFixture<Language>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [Language, LanguageDialog],
            imports: [FormsModule, translateTestImport, NgbModalModule],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [LanguageDialog],
            },
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');

        fixture = TestBed.createComponent(Language);
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
        it('check dialog open/close', function() {
            const langButton = fixture.debugElement.query(By.css('button')).nativeElement;
            langButton.dispatchEvent(new Event('click'));
            fixture.detectChanges();

            expect(document.querySelector('.modal-content')).not.toBe(null);

            document.querySelector('.btn-secondary').dispatchEvent(new Event('click'));

            expect(document.querySelector('.modal-content')).toBe(null);
        });
    });
});



