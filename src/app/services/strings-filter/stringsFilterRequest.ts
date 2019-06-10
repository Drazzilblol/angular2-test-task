import {Statuses} from '../../components/status/statuses';

export class StringsFilterRequest {
    text: string;
    status: Statuses;

    constructor(text: string) {
        this.text = text;
    }
}