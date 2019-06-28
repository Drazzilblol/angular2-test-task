export class Column {
    public width: number;
    public title: string;
    public position: number;
    public resizable: boolean;

    constructor(title, width?, position?, resizable?) {
        this.width = width;
        this.position = position;
        this.title = title;
        this.resizable = resizable;
    }
}
