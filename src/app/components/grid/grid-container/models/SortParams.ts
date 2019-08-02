import {Order} from 'app/enums/order.enum';

export class SortParams {
    public columnName: string;
    public order: Order;

    constructor(columnName: string, order: Order) {
        this.columnName = columnName;
        this.order = order;
    }
}
