import {Statuses} from '../../status/statuses';

export class FilterParams {
    text: string;
    status: string;

    constructor(text: string, status: string) {
        this.text = text;
        this.status = status
    }
}