import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LanguageDialog} from './dialog/languageDialog.component';

@Component({
    selector: 'language',
    templateUrl: './language.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Language {
    constructor(private modalService: NgbModal) {
    }

    /**
     * Открывает диалог выбора языка.
     */
    open() {
        this.modalService.open(LanguageDialog);
    }

}



