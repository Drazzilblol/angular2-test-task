import {ChangeDetectionStrategy, Component, ElementRef, Renderer2} from '@angular/core';
import {BaseGridFilterCellComponent} from 'app/components/grid/base-grid-filter-cell/baseGridFilterCell.component';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-text-filter-cell',
    templateUrl: './gridTextFilterCell.template.html',
    providers: [{provide: BaseGridFilterCellComponent, useExisting: GridTextFilterCellComponent}],
})
export class GridTextFilterCellComponent extends BaseGridFilterCellComponent {

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService) {
        super(elementRef, renderer, columnManager);
    }

    /**
     * Возвращает текущее значение фильтра.
     */
    public getFilterValue() {
        return {column: this.column.name, filter: this.filterForm.value.filter};
    }
}
