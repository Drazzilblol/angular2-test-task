import {Statuses} from '../../status/statuses';

export class StringListItem {
    text: string;
    date: number;
    status: Statuses;

    constructor(text: string, date: number, status: Statuses) {
        this.text = text;
        this.date = date;
        this.status = status
    }
}