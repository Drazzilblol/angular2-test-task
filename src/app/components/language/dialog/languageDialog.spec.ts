import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {NgbActiveModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageDialog} from './languageDialog.component';
import {translateTestImport} from 'tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import languages from '../languages.json'

describe('language', function () {
    let component: LanguageDialog;
    let fixture: ComponentFixture<LanguageDialog>;
    let translate: TranslateService;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, translateTestImport, NgbModalModule],
            declarations: [LanguageDialog],
            providers: [
                NgbActiveModal,
            ]
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.addLangs(languages.languagesList);
        translate.use('en');

        fixture = TestBed.createComponent(LanguageDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
        translate = null;
    });

    describe('dialog', function () {
        it('check dialog cancel', function () {
            fixture.detectChanges();
            spyOn(component, 'cancel').and.callThrough();
            let languageSelect = fixture.nativeElement.querySelector('select');

            expect(fixture.nativeElement.querySelector('.modal-title').textContent).toBe(english.LANGUAGE_MODAL.MESSAGE);
            expect(fixture.nativeElement.querySelector('.btn-secondary').textContent.trim()).toBe(english.LANGUAGE_MODAL.CANCEL);
            expect(fixture.nativeElement.querySelector('.btn-primary').textContent.trim()).toBe(english.LANGUAGE_MODAL.OK);
            expect(languageSelect.options[0].innerText.trim()).toBe(english.LANGUAGES.en);
            expect(languageSelect.options[1].innerText.trim()).toBe(english.LANGUAGES.ru);

            languageSelect.selectedIndex = 1;
            languageSelect.dispatchEvent(new Event('change'));
            fixture.nativeElement.querySelector('.btn-secondary').dispatchEvent(new Event('click'));
            fixture.detectChanges();

            expect(component.cancel).toHaveBeenCalled();
            expect(fixture.nativeElement.querySelector('.modal-title').textContent).toBe(english.LANGUAGE_MODAL.MESSAGE);
        });


        it('check dialog accept', function () {
            fixture.detectChanges();
            let languageSelect = fixture.nativeElement.querySelector('select');
            spyOn(component, 'confirm').and.callThrough();
            languageSelect.selectedIndex = 1;
            languageSelect.dispatchEvent(new Event('change'));
            fixture.nativeElement.querySelector('.btn-primary').dispatchEvent(new Event('click'));
            fixture.detectChanges();

            expect(component.confirm).toHaveBeenCalled();

            expect(fixture.nativeElement.querySelector('.modal-title').textContent).toBe(russian.LANGUAGE_MODAL.MESSAGE);
            expect(fixture.nativeElement.querySelector('.btn-secondary').textContent.trim()).toBe(russian.LANGUAGE_MODAL.CANCEL);
            expect(fixture.nativeElement.querySelector('.btn-primary').textContent.trim()).toBe(russian.LANGUAGE_MODAL.OK);
            expect(languageSelect.options[0].innerText.trim()).toBe(russian.LANGUAGES.en);
            expect(languageSelect.options[1].innerText.trim()).toBe(russian.LANGUAGES.ru);
        });
    });
});



