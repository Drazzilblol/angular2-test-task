import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'modal-content',
    templateUrl: './languageDialog.template.html',
})
export class LanguageDialogComponent {
    /**
     * Массив языков для выпадающего списка.
     */
    public languagesList: string[];
    /**
     * Выбраный язык в выпадающем списке.
     */
    public selected: string;

    /**
     * Заполняет выпадающий список языков, устанавлевает язык по умолчаню.
     */
    constructor(private activeModal: NgbActiveModal, private translate: TranslateService) {
        this.languagesList = translate.getLangs();
        this.selected = translate.currentLang;
    }

    /**
     * Закрывает диалог выбора языка.
     */
    public cancel(): void {
        this.activeModal.close();
    }

    /**
     * Изменяет язык на выбраный и закрывает дилог выбора языка.
     */
    public confirm(): void {
        this.translate.use(this.selected);
        this.activeModal.close();
    }
}
