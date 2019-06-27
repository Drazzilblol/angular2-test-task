export class ColumnOptions {
    public width: number;
    public title: string;

    constructor(title, width?) {
        if (width) {
            this.width = width;
        }
        this.title = title;
    }
}
