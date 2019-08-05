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
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {Order} from 'app/enums/order.enum';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {IColumn} from 'app/services/column-manger-service/IColumn';
import {FilterService} from 'app/services/filter/filter.service';
import {findIndex, sortBy} from 'lodash';
import {SortParams} from './models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid',
    templateUrl: './grid.template.html',
    providers: [ColumnManagerService],
})
export class GridComponent implements OnInit, OnChanges {
    @Input() public filterParams: any = {};
    @Input() public items: any[] = [];
    @Input() public columns: IColumn[] = [];
    @Input() public options: any = {};
    public currentSort: SortParams;
    public filteredItems: any[] = this.items;
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
        const sortColumnIndex = findIndex(this.columns, (col) => {
            return params.columnName === col.name;
        });
        if (this.columns[sortColumnIndex] && this.columns[sortColumnIndex].type !== ColumnsTypes.DATE) {
            this.filteredItems.sort((a, b) => {
                return a[params.columnName].localeCompare(b[params.columnName],
                    undefined,
                    {numeric: true, sensitivity: 'base'});
            });
        } else {
            this.filteredItems = sortBy(this.filteredItems, (a) => {
                return a.date.valueOf();
            });
        }

        if (params.order === Order.DESC) {
            this.filteredItems = this.filteredItems.reverse();
        }
        this.currentSort = params;
    }

    public ngOnInit(): void {
        this.columns = this.columnManager.addColumns(this.columns);
        this.sort(this.options.defaultSort);
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
            if (this.currentSort) {
                this.sort(this.currentSort);
            }
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
