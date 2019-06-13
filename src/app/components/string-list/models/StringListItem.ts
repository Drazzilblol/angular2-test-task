import {Statuses} from '../../status/statuses';
import {isEmpty, filter, isNumber} from "lodash";

export class StringListItem {
    originText: string;
    transformedText: string;
    date: number;
    status: Statuses;

    constructor(text: string, date: number, status: Statuses) {
        this.originText = text;
        this.date = date;
        this.status = status;
        this.transformedText = this.transformString(text);
    }

    /**
     * Извлекает из строки цифры.
     * @param {string} input Исходная строка.
     * @return {string} Если строка не содержит цифры возвращает сообщение,
     * если содержит то возвращает строку состоящую из цифр
     */
    transformString(input: string): string {
        if (isEmpty(input)) return 'MESSAGE';
        let filteredArray = filter(input.split(''), element => !isNaN(+element));
        return filteredArray.length ? filteredArray.join('') : 'MESSAGE';
    };
}