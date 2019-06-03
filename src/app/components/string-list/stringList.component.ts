import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: "strings-list",
    templateUrl: "./stringList.template.html",
})
export class StringList {

    @Input() strings: string[] = [];

    @Output() onDelete: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Создает событие удаления строки из списка.
     * @param {number} index Индекс удаляемой строки в списке.
     */
    deleteItem(index: number) {
        this.onDelete.emit(index);
    }
};


