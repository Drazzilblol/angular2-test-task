'use strict';

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {Language} from './languageController';
import {NgbModal, NgbModalModule, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {LanguageDialog} from './dialog/languageDialogController';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';

describe('language', function () {
    let component: Language;
    let modalService: NgbModal;
    let fixture: ComponentFixture<Language>;
    let modalRef: NgbModalRef;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, TranslateModule.forRoot(), NgbModalModule],
            declarations: [Language, LanguageDialog],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [LanguageDialog],
            }
        });

        modalService = TestBed.get(NgbModal);
    });

    beforeEach(function () {
        fixture = TestBed.createComponent(Language);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
    });

    describe('component', function () {
        it('check is dialog open', function () {
            modalService.open = jasmine.createSpy('open');
            fixture.nativeElement.querySelector('button')
                .dispatchEvent(new Event('click'));
            fixture.detectChanges();

            expect(modalService.open).toHaveBeenCalledWith(LanguageDialog);
        });

        it('check is dialog open', function () {

            fixture.nativeElement.querySelector('button')
                .dispatchEvent(new Event('click'));
            fixture.detectChanges();

            let dialogDomElement = document.querySelector('.modal-content');
            let languageSelect = dialogDomElement.getElementsByTagName('select')[0];
            expect(dialogDomElement.querySelector('.modal-title').textContent).toBe('LANGUAGE_MODAL.MESSAGE');
            expect(dialogDomElement.querySelector('.btn-secondary').textContent.trim()).toBe('LANGUAGE_MODAL.CANCEL');
            expect(dialogDomElement.querySelector('.btn-primary').textContent.trim()).toBe('LANGUAGE_MODAL.OK');
            expect(languageSelect.options[0].innerText.trim()).toBe('LANGUAGES.en');
            expect(languageSelect.options[1].innerText.trim()).toBe('LANGUAGES.ru');
        });

    });
});



