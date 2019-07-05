import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LanguageDialogComponent} from './dialog/languageDialog.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'language',
    templateUrl: './language.template.html',
})
export class LanguageComponent {
    constructor(private modalService: NgbModal) {
    }

    /**
     * Открывает диалог выбора языка.
     */
    public open(): void {
        this.modalService.open(LanguageDialogComponent);
    }

}
