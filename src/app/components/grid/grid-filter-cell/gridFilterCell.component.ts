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
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {DatePickerManagerService} from 'app/services/date-picker-manager/datePickerManager.service';
import moment from 'moment';
import {fromEvent, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

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
            text: new FormControl(''),
        });
        this.initSubscriptions();
    }

    /**
     * Создает подписку на событие input, при срабатывании собтия если оно не происходит опять в течении 500 милисекунд
     * то отправляет данные для фиьтрации.
     */
    protected initSubscriptions(): void {
        super.initSubscriptions();
        this.subscription.add(fromEvent(this.elementRef.nativeElement, 'input')
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.onFilter.emit({column: this.column.dataFieldName, text: this.filterForm.value.text});
            }));
    }

    /**
     * Создает данные для фильтрации из интервала дат, и отправляет их.
     */
    public selectDate(date: any) {
        const parsedDate = moment(date.firstDate.getTime()).format('DD-MM-YYYY')
            + ' - ' + moment(date.secondDate.getTime()).format('DD-MM-YYYY');

        this.filterForm.controls.text.setValue(parsedDate);
        this.onFilter.emit({column: this.column.dataFieldName, text: parsedDate});
    }

    /**
     * Открывает date picker, и подписывается на его событие onSelectDate.
     */
    public openDatePicker(event): void {
        event.stopPropagation();
        if (this.column.date) {
            if (!this.isDatePickerOpened) {
                this.datePickerSubscription = this.datePickerManager
                    .open(this.container)
                    .onSelectDate
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
}
