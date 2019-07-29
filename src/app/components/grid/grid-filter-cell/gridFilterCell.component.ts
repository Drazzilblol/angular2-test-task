import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Output,
    Renderer2,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AbstractGridCellComponent} from 'app/components/grid/abstract-grid-cell/abstractGridCell.component';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {DatePickerManagerService} from 'app/services/date-picker-manager/datePickerManager.service';
import {Subscription} from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-filter-cell',
    templateUrl: './gridFilterCell.template.html',
})
export class GridFilterCellComponent extends AbstractGridCellComponent {

    @ViewChild('container', {read: ViewContainerRef})
    private container: ViewContainerRef;

    @Output() public onFilter = new EventEmitter();
    private filterForm: FormGroup;
    private isDatePickerOpened: boolean = false;
    private mouseClick: () => void;
    private datePickerSubscription: Subscription;
    private parsedDate: string;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService,
                public datePickerManager: DatePickerManagerService) {
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
            if (this.column.type === ColumnsTypes.DATE && this.filterForm.value.filter === '') {
                this.selectDate('');
            } else {
                this.onFilter.emit({column: this.column.dataFieldName, filter: this.filterForm.value.filter});
            }
        }
    }

    /**
     * Создает данные для фильтрации из интервала дат, и отправляет их.
     */
    public selectDate(interval: string) {
        this.parsedDate = interval;
        this.filterForm.controls.filter.setValue(this.parsedDate);
        this.onFilter.emit({column: this.column.dataFieldName, filter: this.parsedDate});
    }

    /**
     * Открывает date picker, и подписывается на его событие onSelectDate.
     */
    public openDatePicker(event): void {
        event.stopPropagation();
        if (this.isDate()) {
            if (!this.isDatePickerOpened) {
                const datePicker = this.datePickerManager
                    .open(this.container);
                datePicker.initialInterval = this.parsedDate;
                this.datePickerSubscription = datePicker.onSelectDate
                    .subscribe((date) => {
                        this.selectDate(date);
                    });
                this.isDatePickerOpened = true;
                this.initClickListener();
            }
        }
    }

    /**
     * Инициализирует слушателя события click по body, если событие произошло не на потомке grid-filter-params-cell то
     * date picker закрывается.
     */
    public initClickListener(): void {
        this.mouseClick = this.renderer.listen('body', 'click', (event) => {
                if (this.elementRef.nativeElement !== event.target.closest('grid-filter-cell')) {
                    this.datePickerManager.close(this.container);
                    this.isDatePickerOpened = false;
                    this.datePickerSubscription.unsubscribe();
                    this.mouseClick();
                }
            },
        );
    }

    public isDate() {
        return this.column.type === ColumnsTypes.DATE;
    }
}
