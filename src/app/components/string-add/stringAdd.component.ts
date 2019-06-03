import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: "string-add",
    templateUrl: "./stringAdd.template.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StringAdd {
    @Output() onAdd: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Создает событие добавления строки в список.
     * @param {string} text Строка которая должна быть добавлена в список.
     */
    addItem(text: string) {
        this.onAdd.emit(text);
    }
};
