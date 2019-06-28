import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Renderer2} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {filter, forEach, size} from 'lodash';
import {Columns} from '../../enums/columns.enum';
import {ColumnManagerService} from '../../services/column-manger-service/columnManager.service';
import {SortParams} from './models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'strings-grid-header',
    templateUrl: './stringGridHeader.template.html',
})
export class StringsGridHeader {
    @Output() public onSort = new EventEmitter<SortParams>();
    @Output() public onResize = new EventEmitter<any>();
    public sortParams = Sort;
    public icon: string = 'expand_more';
    public currentSort: SortParams = new SortParams(Sort.DATE, Order.ASC);
    public columns = Columns;
    public columnsWidth = {
        [Columns.DATE]: 216,
        [Columns.ORIGIN]: 280,
        [Columns.TRANSFORMED]: 280,
    };
    private start: HTMLElement;
    private pressed: boolean;
    private startX: any;
    private startWidth: any;
    private nextElementStartWidth: number;
    private nextElement: HTMLElement;
    private mouseMove: () => void;
    private mouseUp: () => void;

    constructor(private renderer: Renderer2, private columnManagerService: ColumnManagerService,
                private changeDetector: ChangeDetectorRef) {
    }

    /**
     * Отсылает параметры сортировки.
     * @param params Параметры сортировкию
     */
    public sort(params: Sort) {
        if (this.currentSort.order === Order.ASC) {
            this.currentSort.order = Order.DESC;
            this.icon = 'expand_less';
        } else {
            this.currentSort.order = Order.ASC;
            this.icon = 'expand_more';
        }
        this.currentSort.column = params;
        this.onSort.emit(this.currentSort);
    }

    public recalculateHeaderColumns(column, width): void {
        const diff: number = this.columnsWidth[column] - width;
        const columns = this.columnManagerService.columns;

        forEach(columns, (value, key) => {
            if (key !== column && value.resizable && columns[column].position < value.position) {
                this.columnsWidth[key] = this.columnsWidth[key] + diff / (size(filter(columns, (col) => {
                    return col.resizable && columns[column].position < col.position && this.columnsWidth[col.title] >= 110;
                })));
            }
        });
    }

    /**
     * Отслеживает перемещения мыши после нажатия и изменяет ширину колонок в шапке.
     */
    private initResizableColumns() {
        const column: string = this.start.parentElement.title;
        let width: number;
        this.mouseMove = this.renderer.listen('body', 'mousemove', (event) => {
                if (this.pressed) {
                    const diff = (event.pageX - this.startX);
                    width = this.startWidth + diff;
                    const nextElementWidth = this.nextElementStartWidth - diff;

                    if (nextElementWidth > 110 && width >= 110) {
                        this.recalculateHeaderColumns(column, width);
                        this.columnsWidth[column] = width;
                        this.changeDetector.markForCheck();
                    }
                }
            },
        );
        this.mouseUp = this.renderer.listen('body', 'mouseup', () => {
            if (this.pressed) {
                this.columnManagerService.changeWidth(column, this.columnsWidth[column]);
                this.pressed = false;
                this.mouseMove();
                this.mouseUp();
            }
        });
    }

    /**
     * При нажатии на ЛКМ начинает отслеживание перемещений мыши.
     */
    private onMouseDown(event) {
        event.stopPropagation();
        this.start = event.target;
        this.pressed = true;
        this.startX = event.pageX;
        this.startWidth = this.start.parentElement.offsetWidth;
        this.nextElement = this.start.parentElement.nextElementSibling as HTMLElement;
        if (this.nextElement) {
            this.nextElementStartWidth = this.nextElement.offsetWidth;
        }
        this.initResizableColumns();
    }
}
