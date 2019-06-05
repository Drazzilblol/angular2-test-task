import {now} from 'lodash'

export class StringListItem {
    text: string;
    date: number = now();
    status: string = 'FRESH';

    constructor(text: string) {
        this.text = text;
    }
}