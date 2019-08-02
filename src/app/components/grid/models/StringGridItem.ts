import {IGridItem} from 'app/components/grid/models/IGridItem';
import {Statuses} from 'app/enums/statuses.enum';
import {IdGenerator} from 'app/utils/idGenerator';

export class StringGridItem implements IGridItem {
    public originText: string;
    public transformedText: string;
    public status: Statuses;
    public id: string;
    private date: Date;

    constructor(text: string, date: Date, status: Statuses) {
        this.originText = text;
        this.date = date;
        this.status = status;
        this.id = IdGenerator.generateId();
    }
}
