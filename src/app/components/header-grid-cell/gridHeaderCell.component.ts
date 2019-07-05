import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-header-cell',
    templateUrl: './gridHeaderCell.template.html',
})
export class GridHeaderCellComponent implements OnInit {

    @Input() public column: Column;
    @Input() public index: number;
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
        });
    }

    public ngOnInit(): void {
        this.changeCell();
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
     * Отслеживает перемещения мыши после нажатия и изменяет ширину колонок в шапке.
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
     * При нажатии на ЛКМ начинает отслеживание перемещений мыши.
     */
    private onMouseDown(event) {
        event.stopPropagation();
        this.start = event.target;
        this.pressed = true;
        this.startX = event.pageX;
        this.startWidth = this.start.parentElement.offsetWidth;
        this.initResizableColumns();
    }
}
