import {ElementRef, Input, Renderer2, ViewChild, ViewContainerRef,} from '@angular/core';
import {AbstractGridCellComponent} from 'app/components/grid/abstract-grid-cell/abstractGridCell.component';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {get, isFunction} from 'lodash';

export abstract class BaseGridCellComponent extends AbstractGridCellComponent {

    @Input() public item: any;
    public getValue: any;
    public itemValue: any;

    @ViewChild('container', {read: ViewContainerRef})
    private container: ViewContainerRef;

    protected constructor(public elementRef: ElementRef, public renderer: Renderer2,
                          public columnManager: ColumnManagerService) {
        super(elementRef, renderer, columnManager);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.column.functionValue && isFunction(this.column.functionValue)) {
            this.getValue = this.column.functionValue;
        } else {
            this.getValue = function(item, path) {
                return get(item, path);
            };
        }
        this.itemValue = this.getValue(this.item, this.column.name);
    }
}
