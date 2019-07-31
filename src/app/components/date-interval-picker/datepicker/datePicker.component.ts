import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import config from 'app/config.json';
import {DisableDirections} from 'app/enums/disableDirections.enum';
import {startCase} from 'lodash';
import moment from 'moment';
import {Subscription} from 'rxjs';

const DISABLED_ELEMENT_COLOR: string = config.DATE.DISABLED_ELEMENT_COLOR;
const SELECTED_ELEMENT_COLOR: string = config.DATE.SELECTED_ELEMENT_COLOR;
const COMMON_ELEMENT_COLOR: string = config.DATE.COMMON_ELEMENT_COLOR;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'date-picker',
    templateUrl: './datePicker.template.html',
})
export class DatePickerComponent implements OnInit, OnDestroy, OnChanges {
    public currentDate: moment.Moment = moment();
    public selectedDate: Date;
    @Input() public initialDate: Date;
    private time: Date = new Date(0, 0, 0, 0, 0, 0);
    public thisMonth: any[] = [];
    @Output() public onSelectDate = new EventEmitter();
    @Input() public disabledDates: any = {};
    public monthName: string;
    public year: string;
    private subscription: Subscription;

    constructor(private translate: TranslateService, private changeDetector: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.recalculateMonth();
        this.subscription = this.translate.onLangChange.subscribe(() => {
            this.recalculateMonth();
        });
    }

    /**
     * Выделяет выбраную дату, при выборе второй даты отправляет интервал.
     */
    public selectDate(date: Date): void {
        this.selectedDate = date;
        this.selectedDate.setHours(this.time.getHours(), this.time.getMinutes(), this.time.getSeconds());
        this.onSelectDate.emit(this.selectedDate);
        this.recalculateMonth();
  //      this.changeDetector.markForCheck();
    }

    /**
     * Переходит на следующий месяц.
     */
    public nextMonth(): void {
        this.currentDate.add(1, 'month');
        this.recalculateMonth();
    }

    /**
     * Переходит на предыдущий месяц.
     */
    public previousMonth(): void {
        this.currentDate.add(-1, 'month');
        this.recalculateMonth();
    }

    /**
     * Изменяет время выбраной даты.
     */
    public changeTime(time: Date): any {
        this.time = time;
        if (!this.selectedDate) {
            this.selectedDate = this.currentDate.toDate();
        }
        this.selectedDate.setHours(this.time.getHours(), this.time.getMinutes(), this.time.getSeconds());
        this.onSelectDate.emit(this.selectedDate);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.initialDate) {
            this.currentDate = moment(this.initialDate);
            this.selectedDate = this.initialDate;
        }
        if (changes.disabledDates) {
            this.recalculateMonth();
        }
    }

    /**
     * Перерасчитывает название месяца, год, количество дней в месяце и список дат, согласно выбранному дню.
     */
    public recalculateMonth(): void {
        this.monthName = startCase(this.currentDate.locale(this.translate.currentLang).format('MMMM'));
        this.year = this.currentDate.format('YYYY');
        const daysInMonth = this.currentDate.daysInMonth();
        this.thisMonth = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(this.currentDate.year(), this.currentDate.month(), i);
            if (this.isDayDisabled(date)) {
                this.thisMonth.push(this.configureDisabledDay(date));
            } else {
                this.thisMonth.push(this.configureEnabledDay(date));
            }
        }
    }

    /**
     * Проверяет должна ли даты быть заблокирована.
     */
    private isDayDisabled(date: Date) {
        return this.disabledDates &&
            ((this.disabledDates.direction === DisableDirections.FORWARD
                && moment(date).startOf('day').isSameOrAfter(this.disabledDates.date))
                || (this.disabledDates.direction === DisableDirections.BACKWARD
                    && moment(date).endOf('day').isSameOrBefore(this.disabledDates.date)));
    }

    /**
     * Создает заблокированую дату.
     */
    private configureDisabledDay(date: Date) {
        return {
            date,
            weekDay: this.getDayOfWeek(date),
            weekOfMonth: this.getWeekNumber(date),
            color: DISABLED_ELEMENT_COLOR,
            disabled: true,
        };
    }

    /**
     * Создает обычную дату.
     */
    private configureEnabledDay(date: Date) {
        return {
            date,
            weekDay: this.getDayOfWeek(date),
            weekOfMonth: this.getWeekNumber(date),
            color: this.getDayColor(date),
        };
    }

    /**
     * Возвращает цвет обычной ячейки.
     */
    private getDayColor(date: Date) {
        if (this.isDaySelected(date)) {
            return SELECTED_ELEMENT_COLOR;
        } else {
            return COMMON_ELEMENT_COLOR;
        }
    }

    /**
     * Проверяет является ли дата выбраной.
     */
    private isDaySelected(date: Date) {
        return this.selectedDate
            && moment(date).endOf('day').isSameOrAfter(this.selectedDate)
            && moment(date).startOf('day').isSameOrBefore(this.selectedDate);
    }

    /**
     * Рассчитывает день недели.
     */
    public getDayOfWeek(date: Date): number {
        return moment(date).isoWeekday();
    }

    /**
     * Рассчитывает номер недели в месяце.
     */
    public getWeekNumber(date: Date): number {
        return this.calculateWeekNumber(date.getDate(), this.currentDate.startOf('month').isoWeekday());
    }

    /**
     * Рассчитывает номер недели в месяце.
     */
    public calculateWeekNumber(date: number, firstDay: number): number {
        return Math.floor((date + firstDay - 2) / 7) + 1;
    }

    public trackByFn(index): void {
        return index;
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
