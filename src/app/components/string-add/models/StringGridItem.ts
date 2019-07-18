import {IGridItem} from 'app/components/string-add/models/IGridItem';
import {Statuses} from 'app/enums/statuses.enum';
import {IdGenerator} from 'app/utils/idGenerator';
import {filter, isEmpty} from 'lodash';
import moment = require('moment');

const MESSAGE: string = 'MESSAGE';

export class StringGridItem implements IGridItem {
    public parsedDate: string;
    public originText: string;
    public status: Statuses;
    public transformedText: string;
    public id: string;
    private dateMils: Date;

    constructor(text: string, date: Date, status: Statuses) {
        this.originText = text;
        this.dateMils = date;
        this.parsedDate = this.parseDate();
        this.status = status;
        this.transformedText = this.transformString(text);
        this.id = IdGenerator.generateId();
    }

    /**
     * Извлекает из строки цифры.
     * @param {string} input Исходная строка.
     * @return {string} Если строка не содержит цифры возвращает сообщение,
     * если содержит то возвращает строку состоящую из цифр.
     */
    public transformString(input: string): string {
        if (isEmpty(input.trim())) {
            return MESSAGE;
        }
        const filteredArray = filter(input.trim().split(''), (element) => !isNaN(+element));
        return filteredArray.length ? filteredArray.join('') : MESSAGE;
    }

    /**
     * Преобразует дату в строку формата DD-MM-YYYY HH:mm.
     * @return {string} Преобразованя дата.
     */
    private parseDate(): string {
        return moment(this.dateMils.getTime()).format('DD-MM-YYYY HH:mm:ss');
    }

    set date(date: Date) {
        this.dateMils = date;
        this.parsedDate = this.parseDate();
    }

    get date() {
        return this.dateMils;
    }

    public trackByFn(index, item) {
        return item.id + item.status;
    }
}
