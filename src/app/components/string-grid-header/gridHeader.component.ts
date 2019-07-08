import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Column} from 'app/services/column-manger-service/column';
import {find} from 'lodash';
import {SortParams} from './models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-header',
    templateUrl: './gridHeader.template.html',
})
export class GridHeaderComponent implements OnInit {
    @Output() public onSort = new EventEmitter<SortParams>();
    @Input() public columns: Column[] = [];
    public currentSort: SortParams;

    public ngOnInit(): void {
        const defaultSortColumn = find(this.columns, (column) => {
            return column.defaultSort;
        });
        this.currentSort = new SortParams(defaultSortColumn.dataFieldName, Order.ASC);
        this.onSort.emit(this.currentSort);
    }

    public sort(params: SortParams) {
        this.onSort.emit(params);
        this.currentSort = params;
    }
}
