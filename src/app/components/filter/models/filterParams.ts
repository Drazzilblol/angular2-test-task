import {Statuses} from "../../status/statuses";

export class FilterParams {
    text: string;
    status: Statuses;

    constructor(text: string, status: Statuses) {
        this.text = text;
        this.status = status
    }
}