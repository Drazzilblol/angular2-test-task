import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'string-list-container',
    templateUrl: './stringListContainer.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StringListContainer {
    /**
     * Массив строк.
     */
    stringList: string[] = [];

    /**
     * Удаляет строку из массива.
     * @param {number} index Индекс удаляемой строки в массиве.
     */
    deleteItem = (index: number) => this.stringList.splice(index, 1);

    /**
     * Добавляет строку в массив.
     * @param {string} string Строка добавляемая в масиив.
     */
    addItem = (string: string) => this.stringList.push(string);

};

