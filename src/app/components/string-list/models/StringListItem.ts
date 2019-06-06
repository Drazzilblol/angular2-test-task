import {now} from 'lodash'
import {Statuses} from '../../status/statuses';

export class StringListItem {
    text: string;
    date: number = now();
    status: Statuses = Statuses.FRESH;

    constructor(text: string) {
        this.text = text;
    }
}