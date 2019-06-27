import {ChangeDetectionStrategy, Component, EventEmitter, Output, Renderer2} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {forEach, size} from 'lodash';
import {Columns} from '../../enums/columns.enum';
import {ColumnOptions} from '../string-grid-column/models/ColumnOptions';
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

    constructor(private renderer: Renderer2) {
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

    /**
     * Отсылает изменения столбцов.
     * @param options
     */
    public resize(options: ColumnOptions) {
        this.onResize.emit(options);
    }

    public recalculateHeaderColumns(oldOpt, newOpt): void {
        const diff: number = oldOpt - newOpt;
        forEach(this.columnsWidth, (value, key) => {
            if (key !== newOpt.title) {
                this.columnsWidth[key] = value + diff / (size(this.columnsWidth) - 1);
            }
        });
    }

    /**
     * Отслеживает перемещения мыши после нажатия и изменяет ширину колонок в шапке.
     */
    private initResizableColumns() {
        this.mouseMove = this.renderer.listen('body', 'mousemove', (event) => {
                if (this.pressed) {
                    const diff = (event.pageX - this.startX);
                    const width = this.startWidth + diff;
                    const nextElementWidth = this.nextElementStartWidth - diff;

                    if (nextElementWidth > 110 && width > 110) {
                        const column = this.start.parentElement.title;
                        this.recalculateHeaderColumns(this.columnsWidth[column], width);
                        this.columnsWidth[column] = width;
                        this.resize(new ColumnOptions(column, width));
                    }
                }
            },
        );
        this.mouseUp = this.renderer.listen('body', 'mouseup', () => {
            if (this.pressed) {
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
