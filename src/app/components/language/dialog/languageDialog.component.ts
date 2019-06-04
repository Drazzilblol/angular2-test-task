import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'modal-content',
    templateUrl: './languageDialog.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageDialog {
    /**
     * Массив языков для выпадающего списка.
     */
    languagesList: string[];
    /**
     * Выбраный язык в выпадающем списке.
     */
    selected: string;

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
    cancel(): void {
        this.activeModal.close()
    }

    /**
     * Изменяет язык на выбраный и закрывает дилог выбора языка.
     */
    confirm(): void {
        this.translate.use(this.selected);
        this.activeModal.close()
    }


}