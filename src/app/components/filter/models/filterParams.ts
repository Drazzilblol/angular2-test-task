import {Statuses} from 'app/enums/statuses.enum';

export class FilterParams {
    public text: string;
    public status: Statuses;

    constructor(text: string, status: Statuses) {
        this.text = text;
        this.status = status;
    }
}
