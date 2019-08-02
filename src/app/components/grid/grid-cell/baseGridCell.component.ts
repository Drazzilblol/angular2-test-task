import {Compiler, ElementRef, Input, Renderer2, ViewChild, ViewContainerRef,} from '@angular/core';
import {AbstractGridCellComponent} from 'app/components/grid/abstract-grid-cell/abstractGridCell.component';
import {IGridItem} from 'app/components/grid/models/IGridItem';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';

export abstract class BaseGridCellComponent extends AbstractGridCellComponent {

    @Input() public item: IGridItem;
    public getValue: any;

    @ViewChild('container', {read: ViewContainerRef})
    private container: ViewContainerRef;

    protected constructor(public elementRef: ElementRef, public renderer: Renderer2,
                          public columnManager: ColumnManagerService, public compiler: Compiler) {
        super(elementRef, renderer, columnManager);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.getValue = this.column.functionValue;
    }
}
