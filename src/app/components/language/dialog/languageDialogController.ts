'use strict';
import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import languages from "../languages.json"


@Component({
    selector: 'ngbd-modal-content',
    templateUrl: './languageDialogTemplate.html'
})
export class LanguageDialog {

    languagesList = languages.languagesList;
    selected;

    constructor(public activeModal: NgbActiveModal, public translate: TranslateService) {
        this.selected = translate.currentLang;
    }

    cancel() {
       this.activeModal.close()
    }

    confirm() {
        this.translate.use(this.selected)
        this.activeModal.close()
    }


}