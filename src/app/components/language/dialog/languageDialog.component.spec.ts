import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbActiveModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {translateTestImport} from 'tests/testTranslationConfig';
import languages from '../languages.json';
import {LanguageDialog} from './languageDialog.component';

describe('language', function() {
    let component: LanguageDialog;
    let fixture: ComponentFixture<LanguageDialog>;
    let fixtureDebug: DebugElement;
    let translate: TranslateService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [LanguageDialog],
            imports: [FormsModule, translateTestImport, NgbModalModule],
            providers: [
                NgbActiveModal,
            ],
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.addLangs(languages.languagesList);
        translate.use('en');

        fixture = TestBed.createComponent(LanguageDialog);
        component = fixture.componentInstance;
        fixtureDebug = fixture.debugElement;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        translate = null;
        fixtureDebug = null;
    });

    describe('dialog', function() {
        it('check dialog cancel', function() {
            fixture.detectChanges();
            spyOn(component, 'cancel').and.callThrough();
            const languageSelect = fixtureDebug.query(By.css('select')).nativeElement;

            expect(fixtureDebug.query(By.css('.modal-title')).nativeElement.textContent)
                .toBe(english.LANGUAGE_MODAL.MESSAGE);
            expect(fixtureDebug.query(By.css('.btn-secondary')).nativeElement.textContent.trim())
                .toBe(english.LANGUAGE_MODAL.CANCEL);
            expect(fixtureDebug.query(By.css('.btn-primary')).nativeElement.textContent.trim())
                .toBe(english.LANGUAGE_MODAL.OK);
            expect(languageSelect.options[0].innerText.trim()).toBe(english.LANGUAGES.en);
            expect(languageSelect.options[1].innerText.trim()).toBe(english.LANGUAGES.ru);

            languageSelect.selectedIndex = 1;
            languageSelect.dispatchEvent(new Event('change'));
            fixtureDebug.query(By.css('.btn-secondary')).nativeElement.dispatchEvent(new Event('click'));
            fixture.detectChanges();

            expect(component.cancel).toHaveBeenCalled();
            expect(fixtureDebug.query(By.css('.modal-title')).nativeElement.textContent)
                .toBe(english.LANGUAGE_MODAL.MESSAGE);
        });

        it('check dialog accept', function() {
            fixture.detectChanges();
            const languageSelect = fixtureDebug.query(By.css('select')).nativeElement;
            spyOn(component, 'confirm').and.callThrough();
            languageSelect.selectedIndex = 1;
            languageSelect.dispatchEvent(new Event('change'));
            fixtureDebug.query(By.css('.btn-primary')).nativeElement.dispatchEvent(new Event('click'));
            fixture.detectChanges();

            expect(component.confirm).toHaveBeenCalled();

            expect(fixtureDebug.query(By.css('.modal-title')).nativeElement.textContent)
                .toBe(russian.LANGUAGE_MODAL.MESSAGE);
            expect(fixtureDebug.query(By.css('.btn-secondary')).nativeElement.textContent.trim())
                .toBe(russian.LANGUAGE_MODAL.CANCEL);
            expect(fixtureDebug.query(By.css('.btn-primary')).nativeElement.textContent.trim())
                .toBe(russian.LANGUAGE_MODAL.OK);
            expect(languageSelect.options[0].innerText.trim()).toBe(russian.LANGUAGES.en);
            expect(languageSelect.options[1].innerText.trim()).toBe(russian.LANGUAGES.ru);
        });
    });
});
