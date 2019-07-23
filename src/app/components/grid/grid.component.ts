import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {IGridItem} from 'app/components/string-add/models/IGridItem';
import {Order} from 'app/enums/order.enum';
import {IColumn} from 'app/services/column-manger-service/IColumn';
import {FilterService} from 'app/services/filter/filter.service';
import {find} from 'lodash';
import {SortParams} from './models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid',
    templateUrl: './grid.template.html',
})
export class GridComponent implements OnInit, OnChanges {
    @Input() public filterParams: any = {};
    @Input() public items: IGridItem[] = [];
    @Input() public filteredItems: IGridItem[] = this.items;
    @Input() public columns: IColumn[] = [];
    public currentSort: SortParams;

    constructor(private filterService: FilterService) {
    }

    /**
     * Сортирует элементы в порядке указаном в params.
     * @param params
     */
    public sort(params: SortParams): void {
        this.filteredItems.sort((a, b) => {
            return a[params.column].localeCompare(b[params.column],
                undefined,
                {numeric: true, sensitivity: 'base'});
        });
        if (params.order === Order.DESC) {
            this.filteredItems = this.filteredItems.reverse();
        }
        this.currentSort = params;
    }

    public ngOnInit(): void {
        const defaultSortColumn = find(this.columns, (column) => {
            return column.defaultSort;
        });
        this.currentSort = new SortParams(defaultSortColumn.dataFieldName, Order.ASC);
    }

    public filter(params): void {
        this.filterParams[params.column] = params.text;
        this.filteredItems = this.filterService.filterItems(this.items, this.filterParams);
    }

    /**
     * Функиця для отслеживания пересоздания элементов в цикле ngFor, если элементы массива реализуют функцию trackByFn
     * то для отслеживания используется она, если нет то отслеживание происходит по ссылке на элемент.
     */
    public trackByFn<T extends IGridItem>(index, item: T) {
        if (!item.trackByFn) {
            return item;
        }
        return item.trackByFn(index, item);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.filteredItems = this.filterService.filterItems(this.items, this.filterParams);
    }
}
