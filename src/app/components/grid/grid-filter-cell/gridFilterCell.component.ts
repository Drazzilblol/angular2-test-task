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
import moment from 'moment';
import {fromEvent, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

/**
 * Время которое должно пройти после события прежде чем данные отправятся, если за время отсчета произойдет новое
 * событие то отсчет начнется заново.
 */
const DEBOUNCE_TIME: number = 500;

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

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService,
                public datePickerManager: DatePickerManagerService) {
        super(elementRef, renderer, columnManager);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.filterForm = new FormGroup({
            filter: new FormControl(''),
        });
        this.initSubscriptions();
    }

    /**
     * Создает подписку на событие input, при срабатывании события если оно не происходит опять в течении 0.5 секунды
     * то отправляет данные для фильтрации.
     */
    protected initSubscriptions(): void {
        super.initSubscriptions();
        this.subscription.add(fromEvent(this.elementRef.nativeElement, 'input')
            .pipe(debounceTime(DEBOUNCE_TIME))
            .subscribe(() => {
                this.onFilter.emit({column: this.column.dataFieldName, filter: this.filterForm.value.filter});
            }));
    }

    /**
     * Создает данные для фильтрации из интервала дат, и отправляет их.
     */
    public selectDate(date: any) {
        if (date.firstDate && date.secondDate) {
            const parsedDate = `${moment(date.firstDate.getTime())
                .format('DD-MM-YYYY HH:mm:ss')} - ${moment(date.secondDate.getTime())
                .format('DD-MM-YYYY HH:mm:ss')}`;

            this.filterForm.controls.filter.setValue(parsedDate);
            this.onFilter.emit({column: this.column.dataFieldName, filter: parsedDate});
        }
    }

    /**
     * Открывает date picker, и подписывается на его событие onSelectDate.
     */
    public openDatePicker(event): void {
        event.stopPropagation();
        if (this.isDate()) {
            if (!this.isDatePickerOpened) {
                this.datePickerSubscription = this.datePickerManager
                    .open(this.container).onSelectDate
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
