import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: './languageDialog.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageDialog {

    languagesList: string[];
    selected: string;

    constructor(public activeModal: NgbActiveModal, public translate: TranslateService) {
        this.languagesList = translate.getLangs();
        this.selected = translate.currentLang;
    }

    cancel() {
        this.activeModal.close()
    }

    confirm() {
        this.translate.use(this.selected);
        this.activeModal.close()
    }


}