import {ChangeDetectionStrategy, Component, EventEmitter, Output, Renderer2} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {Columns} from 'app/enums/columns.enum';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
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

    private start: HTMLElement;
    private pressed: boolean;
    private startX: any;
    private startWidth: any;
    private nextElementStartWidth: number;
    private nextElement: HTMLElement;
    private mouseMove: () => void;
    private mouseUp: () => void;

    constructor(private renderer: Renderer2, private columnManagerService: ColumnManagerService) {
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
     * Отслеживает перемещения мыши после нажатия и изменяет ширину колонок в шапке.
     */
    private initResizableColumns() {
        const column: string = this.start.parentElement.id;
        let width: number;
        this.mouseMove = this.renderer.listen('body', 'mousemove', (event) => {
                if (this.pressed) {
                    const diff = (event.pageX - this.startX);
                    width = this.startWidth + diff;
                    this.columnManagerService.changeHeaderWidth(column, width);
                }
            },
        );
        this.mouseUp = this.renderer.listen('body', 'mouseup', () => {
            if (this.pressed) {
                this.columnManagerService.changeBodyWidth(column);
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
