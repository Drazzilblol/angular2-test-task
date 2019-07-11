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

    private start: HTMLElement;
    private pressed: boolean;
    private startX: any;
    private startWidth: any;
    private mouseMove: () => void;
    private mouseUp: () => void;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService) {
        columnManager.getObservable().subscribe((options) => {
            if (options.type === 'header') {
                this.changeCell();
            }
            if (options.type === 'move') {
                this.changeIndex(findIndex(options.cols, (col) => {
                    return this.column === col;
                }));
            }
        });
    }

    public changeIndex(index: number): void {
        this.index = index;
        this.changeCell();
    }

    public ngOnInit(): void {
        this.changeCell();
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
     * Задает ширину и номер ячейки в таблице.
     */
    public changeCell(): void {
        this.renderer.setStyle(this.elementRef.nativeElement,
            'width',
            this.column.width + 'px');
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

    /**
     * Отслеживает перемещения мыши после нажатия на границе колонки и изменяет ширину колонок в шапке.
     */
    private initResizableColumns() {
        let width: number;
        this.mouseMove = this.renderer.listen('body', 'mousemove', (event) => {
                if (this.pressed) {
                    const diff = (event.pageX - this.startX);
                    width = this.startWidth + diff;
                    this.columnManager.changeHeaderWidth(this.index, width);
                }
            },
        );
        this.mouseUp = this.renderer.listen('body', 'mouseup', () => {
            if (this.pressed) {
                this.columnManager.changeBodyWidth();
                this.pressed = false;
                this.mouseMove();
                this.mouseUp();
            }
        });
    }

    /**
     * При нажатии на границе колонки начинает отслеживание перемещений мыши.
     */
    private onMouseDown(event) {
        event.stopPropagation();
        this.start = event.target;
        this.pressed = true;
        this.startX = event.pageX;
        this.startWidth = this.start.parentElement.offsetWidth;
        this.initResizableColumns();
    }

    public onLongClickStart() {
        this.columnManager.columnDragStart(this.index);
    }

    public onLongClickEnd() {
        this.columnManager.columnDragEnd(this.index);
    }
}
