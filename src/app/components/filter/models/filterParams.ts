import {Statuses} from 'app/enums/statuses.enum';

export class FilterParams {
    text: string;
    status: Statuses;

    constructor(text: string, status: Statuses) {
        this.text = text;
        this.status = status
    }
}