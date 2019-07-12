import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Renderer2,
} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {findIndex} from 'lodash';
import {SortParams} from '../string-grid-container/models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-header-cell',
    templateUrl: './gridHeaderCell.template.html',
})
export class GridHeaderCellComponent implements OnInit {

    @Output() public onSort = new EventEmitter<SortParams>();
    @Output() public longClickEnd = new EventEmitter();
    @Output() public longClickStart = new EventEmitter();
    @Input() public column: Column;
    @Input() public index: number;
    @Input() public currentSort: SortParams;
    public icon: string = 'expand_more';
    public edges = {left: false, right: false};

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService) {
        columnManager.getObservable().subscribe((options) => {
            if (options.type === 'header') {
                this.changeWidth();
            }
            if (options.type === 'move') {
                this.changeIndex(findIndex(options.cols, (col) => {
                    return this.column === col;
                }));
                this.constructResizeEdges(options.cols);
            }
        });
    }

    public changeIndex(index: number): void {
        this.index = index;
        this.changePosition();
    }

    public ngOnInit(): void {
        this.constructResizeEdges(this.columnManager.getColumns());
        this.changeWidth();
        this.changePosition();
    }

    public constructResizeEdges(columns: Column[]) {
        if (columns[this.index - 1] && this.index !== 0) {
            this.edges.left = columns[this.index - 1].resizable;
        }
        if (columns[this.index + 1] && this.index + 1 < columns.length) {
            this.edges.right = columns[this.index + 1].resizable;
        }
        if (this.index + 1 === columns.length) {
            this.edges.right = false;
        }
        if (this.index === 0) {
            this.edges.left = false;
        }
    }

    /**
     * Отсылает параметры сортировки.
     * @param params Параметры сортировкию
     */
    public sort(params: Column) {
        if (this.currentSort.order === Order.ASC && this.currentSort.column === this.column.dataFieldName) {
            this.currentSort.order = Order.DESC;
            this.icon = 'expand_less';
        } else {
            this.currentSort.order = Order.ASC;
            this.icon = 'expand_more';
        }
        this.onSort.emit(new SortParams(this.column.dataFieldName, this.currentSort.order));
    }

    /**
     * Задает ширину ячейки в таблице.
     */
    public changeWidth(): void {
        this.renderer.setStyle(this.elementRef.nativeElement,
            'width',
            this.column.width + 'px');
    }

    /**
     * Задает номер колонки для ячейки в таблице.
     */
    public changePosition(): void {
        this.renderer.setStyle(this.elementRef.nativeElement,
            '-ms-grid-column',
            this.index + 1);
        this.renderer.setStyle(this.elementRef.nativeElement,
            '-ms-grid-row',
            1);
        this.renderer.setStyle(this.elementRef.nativeElement,
            'grid-column',
            this.index + 1);
        this.renderer.setStyle(this.elementRef.nativeElement,
            'grid-row',
            1);
    }

    public onLongClickStart() {
        this.columnManager.columnDragStart(this.index);
    }

    public onLongClickEnd() {
        this.columnManager.columnDragEnd(this.index);
    }

    public onResize(event) {
        this.columnManager.changeHeaderWidth(this.index, event.width, event.resizeEdge);
    }

    public onResizeEnd() {
        this.columnManager.changeBodyWidth();
    }
}
