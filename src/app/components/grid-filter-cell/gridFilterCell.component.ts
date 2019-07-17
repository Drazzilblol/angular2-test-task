import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, Renderer2} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AbstractGridCellComponent} from 'app/components/abstract-grid-cell/abstractGridCell.component';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-filter-cell',
    templateUrl: './gridFilterCell.template.html',
})
export class GridFilterCellComponent extends AbstractGridCellComponent {

    @Output() public onFilter = new EventEmitter();
    private filterForm: FormGroup;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService) {
        super(elementRef, renderer, columnManager);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.filterForm = new FormGroup({
            text: new FormControl(''),
        });
        this.initSubscriptions();
    }

    protected initSubscriptions(): void {
        super.initSubscriptions();
        this.subscription.add(fromEvent(this.elementRef.nativeElement, 'input')
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.onFilter.emit({column: this.column.dataFieldName, text: this.filterForm.value.text});
            }));
    }
}
