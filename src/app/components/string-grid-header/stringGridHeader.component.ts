import {ChangeDetectionStrategy, Component, EventEmitter, Output, Renderer2} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {Columns} from '../../enums/columns.enum';
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
        [Columns.DATE]: 220,
        [Columns.ORIGIN]: 280,
        [Columns.TRANSFORMED]: 280,
    };
    private start: HTMLElement;
    private pressed: boolean;
    private startX: any;
    private startWidth: any;
    private nextElementStartWidth: number;
    private nextElement: HTMLElement;

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
     * @param column Изменяемы столбец.
     * @param nextColumn Соседний столбец, который изменяется в зависимости от изменений основного столбца.
     * @param width Новая ширина основного столбца.
     */
    public resize(column: string, nextColumn: string, width: number) {
        this.onResize.emit({column, nextColumn, width});
    }

    /**
     * Отслеживает перемещения мыши после нажатия и изменяет ширину колонок в шапке.
     */
    private initResizableColumns() {
        this.renderer.listen('body', 'mousemove', (event) => {
                if (this.pressed) {
                    const diff = (event.x - this.startX);
                    const width = this.startWidth + diff;
                    if (this.nextElementStartWidth - diff > 110 && width > 110) {
                        if (this.start.parentElement.classList.contains(Columns.DATE)) {
                            this.columnsWidth[Columns.DATE] = width;
                            this.resize(Columns.DATE, '', width);
                        } else if (this.start.parentElement.classList.contains(Columns.ORIGIN)) {
                            this.columnsWidth[Columns.ORIGIN] = width;
                            this.columnsWidth[Columns.DATE] = this.nextElementStartWidth - diff;
                            this.resize(Columns.ORIGIN, Columns.DATE, width);
                        } else if (this.start.parentElement.classList.contains(Columns.TRANSFORMED)) {
                            this.columnsWidth[Columns.TRANSFORMED] = width;
                            this.columnsWidth[Columns.ORIGIN] = this.nextElementStartWidth - diff;
                            this.resize(Columns.TRANSFORMED, Columns.ORIGIN, width);
                        }
                    }
                }
            },
        );
        this.renderer.listen('body', 'mouseup', () => {
            if (this.pressed) {
                this.pressed = false;
            }
        });
    }

    /**
     * При нажатии на ЛКМ начинает отслеживание перемещений мыши.
     */
    private onMouseDown(event) {
        this.start = event.target;
        this.pressed = true;
        this.startX = event.x;
        this.startWidth = this.start.parentElement.offsetWidth;
        this.nextElement = this.start.parentElement.nextElementSibling as HTMLElement;
        if (this.nextElement) {
            this.nextElementStartWidth = this.nextElement.offsetWidth;
        }
        this.initResizableColumns();
        event.stopPropagation();
    }
}
