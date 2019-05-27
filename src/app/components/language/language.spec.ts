'use strict';

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Language} from './languageController';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {LanguageDialog} from './dialog/languageDialogController';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {imports} from '../../../tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';

import english from '../../locales/locale-en.json';
import russian from '../../locales/locale-ru.json';


describe('language', function () {
    let component: Language;
    let fixture: ComponentFixture<Language>;
    let translate: TranslateService;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, imports, NgbModalModule],
            declarations: [Language, LanguageDialog],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [LanguageDialog],
            }
        });

        translate = TestBed.get(TranslateService);
        translate.use('en')
    });

    beforeEach(function () {
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

        it('check dialog cancel', function () {

            let langButton = fixture.nativeElement.querySelector('button');
            langButton.dispatchEvent(new Event('click'));
            fixture.detectChanges();

            let dialogDomElement = document.querySelector('.modal-content');
            let languageSelect = dialogDomElement.getElementsByTagName('select')[0];
            expect(dialogDomElement.querySelector('.modal-title').textContent).toBe(english.LANGUAGE_MODAL.MESSAGE);
            expect(dialogDomElement.querySelector('.btn-secondary').textContent.trim()).toBe(english.LANGUAGE_MODAL.CANCEL);
            expect(dialogDomElement.querySelector('.btn-primary').textContent.trim()).toBe(english.LANGUAGE_MODAL.OK);
            expect(languageSelect.options[0].innerText.trim()).toBe(english.LANGUAGES.en);
            expect(languageSelect.options[1].innerText.trim()).toBe(english.LANGUAGES.ru);

            languageSelect.selectedIndex = 1;
            languageSelect.dispatchEvent(new Event('change'));
            dialogDomElement.querySelector('.btn-secondary').dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(langButton.innerText).toBe(english.BUTTON_LANGUAGE);
        });

        it('check dialog accept', function () {
            let langButton = fixture.nativeElement.querySelector('button');
            langButton.dispatchEvent(new Event('click'));
            fixture.detectChanges();

            let dialogDomElement = document.querySelector('.modal-dialog');
            let languageSelect = dialogDomElement.getElementsByTagName('select')[0];

            languageSelect.selectedIndex = 1;
            languageSelect.dispatchEvent(new Event('change'));
            dialogDomElement.querySelector('.btn-primary').dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(langButton.innerText).toBe(russian.BUTTON_LANGUAGE);
        });

    });
});



