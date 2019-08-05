import {ChangeDetectionStrategy, Component, ElementRef, Renderer2} from '@angular/core';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {BaseGridCellComponent} from '../grid-cell/baseGridCell.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'status-grid-cell',
    templateUrl: './statusGridCell.template.html',
})
export class StatusGridCellComponent extends BaseGridCellComponent {

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService) {
        super(elementRef, renderer, columnManager);
    }
}
