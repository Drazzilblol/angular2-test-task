import {Statuses} from 'app/enums/statuses.enum';
import {filter, isEmpty} from 'lodash';

const MESSAGE: string = 'MESSAGE';

export class StringListItem {
    public date: number;
    public originText: string;
    public status: Statuses;
    public transformedText: string;

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
    public transformString(input: string): string {
        if (isEmpty(input)) {
            return MESSAGE;
        }
        const filteredArray = filter(input.split(''), (element) => !isNaN(+element));
        return filteredArray.length ? filteredArray.join('') : MESSAGE;
    }
}
