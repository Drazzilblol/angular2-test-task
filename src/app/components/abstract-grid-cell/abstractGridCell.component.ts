import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {findIndex} from 'lodash';
import {Subscription} from 'rxjs';

@Component({})
export abstract class AbstractGridCellComponent implements OnInit, OnDestroy {

    @Input() public column: any;
    @Input() public index: number;

    protected subscription: Subscription = new Subscription();

    protected constructor(public elementRef: ElementRef, public renderer: Renderer2,
                          public columnManager: ColumnManagerService) {
        this.initSubscriptions();
    }

    protected initSubscriptions(): void {
        this.subscription.add(this.columnManager.getObservable().subscribe((options) => {
            if (options.type === 'body') {
                this.changeWidth();
            }
            if (options.type === 'move') {
                this.changeIndex(findIndex(options.cols, (col) => {
                    return this.column === col;
                }));
            }
        }));
    }

    protected changeIndex(index: number): void {
        this.index = index;
        this.changePosition();
    }

    public ngOnInit(): void {
        this.changeWidth();
        this.changePosition();
    }

    /**
     * Задает ширину ячейки в таблице.
     */
    protected changeWidth(): void {
        this.renderer.setStyle(this.elementRef.nativeElement.parentNode,
            'width',
            this.column.width + 'px');
    }

    /**
     * Задает номер колонки для ячейки в таблице.
     */
    protected changePosition(): void {
        this.renderer.setStyle(this.elementRef.nativeElement.parentNode,
            '-ms-grid-column',
            this.index + 1);
        this.renderer.setStyle(this.elementRef.nativeElement.parentNode,
            '-ms-grid-row',
            1);
        this.renderer.setStyle(this.elementRef.nativeElement.parentNode,
            'grid-column',
            this.index + 1);
        this.renderer.setStyle(this.elementRef.nativeElement.parentNode,
            'grid-row',
            1);
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
