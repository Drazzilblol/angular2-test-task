import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';

export class SortParams {
    public column: Sort;
    public order: Order;

    constructor(column: Sort, order: Order) {
        this.column = column;
        this.order = order;
    }
}
