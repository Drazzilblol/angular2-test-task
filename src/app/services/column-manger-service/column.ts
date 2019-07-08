import {StringListItem} from '../../components/string-grid-container/models/StringListItem';

export class Column {
    public width: number;
    public title: string;
    public text: string;
    public dataFieldName: string;
    public resizable: boolean;
    public sortable: boolean;
    public defaultSort: boolean;

    constructor(title, text, dataFieldName, width, options?) {
        this.width = width;
        this.title = title;
        this.text = text;
        this.dataFieldName = dataFieldName;
        if (options) {
            this.resizable = options.resizable || false;
            this.sortable = options.sortable || false;
            this.defaultSort = options.defaultSort || false;
        }
    }

    public functionValue(item: StringListItem): any {
        if (this.dataFieldName === 'status') {
            return `<div class="status" [ngClass]="item.status | colorsPipe" placement="left"
                        [ngbTooltip]="'STATUS.' + item.status | translate" container="body">
                    </div>`;
        } else {
            return `<div class="content" placement="left" [ngbTooltip]="'${item[this.dataFieldName]}' | translate"
                    container="body">
                        {{'${item[this.dataFieldName]}' | translate}}
                    </div>`;
        }
    }
}
