import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Column} from 'app/services/column-manger-service/column';
import {find} from 'lodash';
import {FilterParams} from '../filter/models/filterParams';
import {SortParams} from './models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'grid',
    templateUrl: './grid.template.html',
})
export class GridComponent implements OnInit {
    @Input() public filterParams: FilterParams = new FilterParams('', null);
    @Input() public items: any[] = [];
    @Input() public columns: Column[] = [];
    public currentSort: SortParams;

    constructor(private changeDetector: ChangeDetectorRef) {
    }

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
        this.changeDetector.markForCheck();
    }

    public ngOnInit(): void {
        const defaultSortColumn = find(this.columns, (column) => {
            return column.defaultSort;
        });
        this.currentSort = new SortParams(defaultSortColumn.dataFieldName, Order.ASC);
    }
}
