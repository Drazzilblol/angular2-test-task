import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, Renderer2} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AbstractGridCellComponent} from 'app/components/abstract-grid-cell/abstractGridCell.component';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import moment = require('moment');

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-filter-cell',
    templateUrl: './gridFilterCell.template.html',
})
export class GridFilterCellComponent extends AbstractGridCellComponent {

    @Output() public onFilter = new EventEmitter();
    private filterForm: FormGroup;

    private isDatePickerOpened: boolean = false;

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

    public dateClick() {
        if (!this.isDatePickerOpened) {
            this.elementRef.nativeElement.querySelector('datepicker').style.visibility = 'visible';
            this.isDatePickerOpened = true;
        } else {
            this.elementRef.nativeElement.querySelector('datepicker').style.visibility = 'hidden';
            this.isDatePickerOpened = false;
        }
    }

    public selectDate(date: any) {
        const parsedDate = moment(date.firstDate.getTime()).format('DD-MM-YYYY')
            + ' - ' + moment(date.secondDate.getTime()).format('DD-MM-YYYY');

        this.filterForm.controls.text.setValue(parsedDate);
        this.onFilter.emit({column: this.column.dataFieldName, text: parsedDate});
    }
}
