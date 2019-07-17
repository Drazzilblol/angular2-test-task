import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {find} from 'lodash';
import {SortParams} from './models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid',
    templateUrl: './grid.template.html',
})
export class GridComponent implements OnInit {
    @Input() public filterParams: any = {};
    @Input() public items: any[] = [];
    @Input() public columns: any[] = [];
    public currentSort: SortParams;

    /**
     * Сортирует элементы в порядке указаном в params.
     * @param params
     */
    public sort(params: SortParams): void {
        this.items.sort((a, b) => {
            return a[params.column].localeCompare(b[params.column],
                undefined,
                {numeric: true, sensitivity: 'base'});
        });
        if (params.order === Order.DESC) {
            this.items = this.items.reverse();
        }
        this.currentSort = params;
    }

    public ngOnInit(): void {
        const defaultSortColumn = find(this.columns, (column) => {
            return column.defaultSort;
        });
        this.currentSort = new SortParams(defaultSortColumn.dataFieldName, Order.ASC);
    }

    public static trackByFn(index, item) {
        return item.status;
    }

    public filter(params): void {
        this.filterParams[params.column] = params.text;
    }
}
