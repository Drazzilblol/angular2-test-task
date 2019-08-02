import {ChangeDetectionStrategy, Compiler, Component, ElementRef, Renderer2} from '@angular/core';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {BaseGridCellComponent} from '../grid-cell/baseGridCell.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'date-grid-cell',
    templateUrl: './dateGridCell.template.html',
})
export class DateGridCellComponent extends BaseGridCellComponent {
    public date: string;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService,
                public compiler: Compiler) {
        super(elementRef, renderer, columnManager, compiler);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.date = this.getValue(this.item, this.column.name);
    }

}
