import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {SortParams} from './models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'strings-grid-header',
    templateUrl: './stringGridHeader.template.html',
})
export class StringsGridHeader {
    @Output() public onSort = new EventEmitter<SortParams>();
    public sortParams = Sort;
    public icon: string = 'expand_less';
    public currentSort: SortParams = new SortParams(null, null);

    public sort(params: Sort) {
        if (this.currentSort.order === Order.ASC) {
            this.currentSort.order = Order.DESC;
            this.icon = 'expand_less';
        } else {
            this.currentSort.order = Order.ASC;
            this.icon = 'expand_more';
        }
        this.currentSort.column = params;
        this.onSort.emit(this.currentSort);
    }
}
