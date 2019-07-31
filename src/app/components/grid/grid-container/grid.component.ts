import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from '@angular/core';
import {GridFilterCellComponent} from 'app/components/grid/grid-filter-cell/gridFilterCell.component';
import {IGridItem} from 'app/components/string-add/models/IGridItem';
import {Order} from 'app/enums/order.enum';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {IColumn} from 'app/services/column-manger-service/IColumn';
import {FilterService} from 'app/services/filter/filter.service';
import {find} from 'lodash';
import {SortParams} from './models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid',
    templateUrl: './grid.template.html',
    providers: [ColumnManagerService],
})
export class GridComponent implements OnInit, OnChanges {
    @Input() public filterParams: any = {};
    @Input() public items: IGridItem[] = [];
    @Input() public columns: IColumn[] = [];
    public currentSort: SortParams;
    public filteredItems: IGridItem[] = this.items;

    @ViewChildren(GridFilterCellComponent)
    private filterCells: QueryList<GridFilterCellComponent>;

    constructor(private filterService: FilterService, private columnManager: ColumnManagerService) {
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
        this.columns = this.columnManager.addColumns(this.columns);
        const defaultSortColumn = find(this.columns, (column) => {
            return column.defaultSort;
        });
        this.currentSort = new SortParams(defaultSortColumn.dataFieldName, Order.ASC);
    }

    /**
     * Фильтрует элементы согласно параметрам фильтрации.
     */
    public filterItems(): void {
        this.filteredItems = this.filterService.filterItems(this.items, this.filterParams);
    }

    public trackByFn(index: number, item: IGridItem): any {
        return item.trackByFn(index, item);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.items) {
            this.filteredItems = this.filterService.filterItems(this.items, this.filterParams);
        } else if (changes.filterParams) {
            this.filterItems();
        }
    }

    /**
     * Получает текущие значения всех фильтров, и фильтрует массив элементов.
     */
    public filter() {
        this.filterCells.forEach((item) => {
            const filterValue = item.getFilterValue();
            this.filterParams[filterValue.column] = filterValue.filter;
        });
        this.filterItems();
    }
}
