import {Order} from 'app/enums/order.enum';

export class SortParams {
    public column: string;
    public order: Order;

    constructor(column: string, order: Order) {
        this.column = column;
        this.order = order;
    }
}
