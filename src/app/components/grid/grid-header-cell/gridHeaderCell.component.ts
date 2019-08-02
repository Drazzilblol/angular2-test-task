import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {AbstractGridCellComponent} from 'app/components/grid/abstract-grid-cell/abstractGridCell.component';
import {ColumnManagerStatuses} from 'app/enums/columnManagerStatuses.enum';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {Order} from 'app/enums/order.enum';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {IColumn} from 'app/services/column-manger-service/IColumn';
import {findIndex} from 'lodash';
import {SortParams} from '../grid-container/models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-header-cell',
    templateUrl: './gridHeaderCell.template.html',
})
export class GridHeaderCellComponent extends AbstractGridCellComponent {

    @Output() public onSort = new EventEmitter<SortParams>();
    @Output() public onDragEnd = new EventEmitter();
    @Output() public onDragStart = new EventEmitter();
    @Input() public currentSort: SortParams;
    private icon: string = 'expand_more';
    private edges = {left: false, right: false};

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService) {
        super(elementRef, renderer, columnManager);
        this.initSubscriptions();
    }

    protected initSubscriptions(): void {
        this.subscription.add(this.columnManager.getObservable().subscribe((options) => {
            if (options.type === ColumnManagerStatuses.HEADER) {
                this.changeWidth();
            }
            if (options.type === ColumnManagerStatuses.MOVE) {
                this.changeIndex(findIndex(options.cols, (col) => {
                    return this.column === col;
                }));
                this.constructResizeEdges(options.cols);
            }
        }));
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.constructResizeEdges(this.columnManager.getColumns());
    }

    /**
     * На основании соседних колонок создает границы колонки для изменения ширины.
     * @param columns
     */
    private constructResizeEdges(columns: IColumn[]) {
        if (columns[this.index - 1]) {
            this.edges.left = columns[this.index - 1].resizable;
        } else {
            this.edges.left = false;
        }
        if (columns[this.index + 1]) {
            this.edges.right = columns[this.index + 1].resizable;
        } else {
            this.edges.right = false;
        }
    }

    /**
     * Отсылает параметры сортировки.
     * @param params параметры сортировкию
     */
    private sort(params: any) {
        if (this.currentSort.order === Order.ASC && this.currentSort.columnName === this.column.name) {
            this.currentSort.order = Order.DESC;
            this.icon = 'expand_less';
        } else {
            this.currentSort.order = Order.ASC;
            this.icon = 'expand_more';
        }
        this.onSort.emit(new SortParams(this.column.name, this.currentSort.order));
    }

    public dragStart() {
        this.columnManager.columnDragStart(this.index);
    }

    public dragEnd() {
        this.columnManager.columnDragEnd(this.index);
    }

    public onResize(event) {
        this.columnManager.changeHeaderWidth(this.index, event.width, event.resizeEdge);
    }

    public onResizeEnd() {
        this.columnManager.changeBodyWidth();
    }

    public isStatus() {
        return this.column.type !== ColumnsTypes.STATUS;
    }

    public isCurrentSort() {
        return this.column.name === this.currentSort.columnName;
    }
}
