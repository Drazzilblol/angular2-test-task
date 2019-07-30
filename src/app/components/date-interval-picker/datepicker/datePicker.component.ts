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
import {startCase} from 'lodash';
import moment from 'moment';
import {Subscription} from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'date-picker',
    templateUrl: './datePicker.template.html',
})
export class DatePickerComponent implements OnInit, OnDestroy, OnChanges {
    public currentDate: moment.Moment = moment();
    public thisMonth: any[] = [];
    @Output() public onSelectDate = new EventEmitter();
    public selectedDate: Date;
    @Input() public dateBlock: any = {};
    @Input() public initialDate: Date;
    public monthName: string;
    public year: string;
    private subscription: Subscription;
    private time: Date = new Date(0, 0, 0, 0, 0, 0);

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
        date.setHours(this.time.getHours(), this.time.getMinutes(), this.time.getSeconds());
        this.onSelectDate.emit(date);
        this.recalculateMonth();
        this.changeDetector.markForCheck();
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

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
            this.currentDate.hour(0).minute(0).second(0);
            this.selectedDate = this.initialDate;
        }
        if (changes.dateBlock) {
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
            const date = new Date(this.currentDate.year().valueOf(), this.currentDate.month().valueOf(), i);
            if (this.isDisabledDay(date)) {
                this.thisMonth.push(this.configureDisabledDay(date));
            } else {
                this.thisMonth.push(this.configureEnabledDay(date));
            }
        }
    }

    private isDisabledDay(date: Date) {
        return this.dateBlock &&
            ((this.dateBlock.direction === 'forward'
                && moment(date).startOf('day').isSameOrAfter(this.dateBlock.date))
                || (this.dateBlock.direction === 'backward'
                    && moment(date).endOf('day').isSameOrBefore(this.dateBlock.date)));
    }

    private configureDisabledDay(date: Date) {
        return {
            date,
            weekDay: this.getDayOfWeek(date),
            weekOfMonth: this.getWeekNumber(date),
            color: 'lightgray',
            disabled: true,
        };
    }

    private configureEnabledDay(date: Date) {
        return {
            date,
            weekDay: this.getDayOfWeek(date),
            weekOfMonth: this.getWeekNumber(date),
            color: this.getDayColor(date),
        };
    }

    private getDayColor(date: Date) {
        if (this.selectedDate && moment(date).endOf('day').isSameOrAfter(this.selectedDate)
            && moment(date).startOf('day').isSameOrBefore(this.selectedDate)) {
            return 'lightblue';
        } else {
            return 'white';
        }
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
        return this.calculateWeekNumber(date.getDate(), moment(this.currentDate).startOf('month').isoWeekday());
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
}
