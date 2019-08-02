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
import {BaseGridFilterCellComponent} from 'app/components/grid/base-grid-filter-cell/baseGridFilterCell.component';
import {IGridItem} from 'app/components/grid/models/IGridItem';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
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
    @Input() public options: any = {};
    public currentSort: SortParams;
    public filteredItems: IGridItem[] = this.items;
    public columnTypes = ColumnsTypes;
    public trackByFn: any;

    @ViewChildren(BaseGridFilterCellComponent)
    private filterCells: QueryList<BaseGridFilterCellComponent>;

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
            return column.title === this.options.defaultSort;
        });
        this.currentSort = new SortParams(defaultSortColumn.name, Order.ASC);
        this.trackByFn = this.options.trackByFunction;
    }

    /**
     * Фильтрует элементы согласно параметрам фильтрации.
     */
    public filterItems(): void {
        this.filteredItems = this.filterService.filterItems(this.items, this.filterParams);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.filterParams || changes.items) {
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
