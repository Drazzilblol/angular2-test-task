import {ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {IntervalPickerComponent} from 'app/components/date-interval-picker/interval-picker/intervalPicker.component';
import {BaseGridFilterCellComponent} from 'app/components/grid/base-grid-filter-cell/baseGridFilterCell.component';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {DatePickerManagerService} from 'app/services/date-picker-manager/datePickerManager.service';
import {Subscription} from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-date-filter-cell',
    templateUrl: './gridDateFilterCell.template.html',
    providers: [{provide: BaseGridFilterCellComponent, useExisting: GridDateFilterCellComponent}],
})
export class GridDateFilterCellComponent extends BaseGridFilterCellComponent {

    @ViewChild('container', {read: ViewContainerRef})
    private container: ViewContainerRef;

    private isDatePickerOpened: boolean = false;
    private mouseClick: () => void;
    private datePickerSubscription: Subscription;
    private parsedDate: string;
    private datePicker: IntervalPickerComponent;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService,
                public datePickerManager: DatePickerManagerService) {
        super(elementRef, renderer, columnManager);
    }

    /**
     * Открывает date picker, и подписывается на его событие onSelectDates.
     */
    public openDatePicker(event): void {
        event.stopPropagation();
        if (!this.isDatePickerOpened) {
            this.datePicker = this.datePickerManager
                .open(this.container);
            this.datePicker.initialInterval = this.parsedDate;
            this.datePickerSubscription = this.datePicker.onSelectDates
                .subscribe((date) => {
                    this.selectDate(date);
                    this.onFilter.emit();
                });
            this.isDatePickerOpened = true;
            this.initClickListener();
        }
    }

    /**
     * Возвращает текущее значение фильтра.
     */
    public getFilterValue() {
        this.selectDate(this.filterForm.value.filter);
        if (this.isDatePickerOpened) {
            this.datePicker.parseDateInterval(this.filterForm.value.filter);
        }
        return {column: this.column.name, filter: this.filterForm.value.filter};
    }

    /**
     * Создает данные для фильтрации из интервала дат, и отправляет их.
     */
    public selectDate(interval: string) {
        this.parsedDate = interval;
        this.filterForm.controls.filter.setValue(this.parsedDate);
    }

    /**
     * Инициализирует слушателя события click по body, если событие произошло не на потомке grid-filter-params-cell то
     * date picker закрывается.
     */
    public initClickListener(): void {
        this.mouseClick = this.renderer.listen('body', 'click', (event) => {
                if (this.elementRef.nativeElement !== event.target.closest('grid-date-filter-cell')) {
                    this.datePickerManager.close(this.container);
                    this.isDatePickerOpened = false;
                    this.datePickerSubscription.unsubscribe();
                    this.mouseClick();
                }
            },
        );
    }
}
