import {ElementRef, EventEmitter, Output, Renderer2} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AbstractGridCellComponent} from 'app/components/grid/abstract-grid-cell/abstractGridCell.component';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';

export abstract class BaseGridFilterCellComponent extends AbstractGridCellComponent {

    @Output() public onFilter = new EventEmitter();
    protected filterForm: FormGroup;

    protected constructor(public elementRef: ElementRef, public renderer: Renderer2,
                          public columnManager: ColumnManagerService) {
        super(elementRef, renderer, columnManager);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.filterForm = new FormGroup({
            filter: new FormControl(''),
        });
    }

    /**
     * При нажатии на Enter фильтрует список.
     */
    public enterPress(event) {
        if (event.key === 'Enter') {
            this.onFilter.emit({column: this.column.name, filter: this.filterForm.value.filter});
        }
    }

    public abstract getFilterValue();
}
