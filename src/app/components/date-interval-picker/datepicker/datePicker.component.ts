import {
    ChangeDetectionStrategy,
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
    public selectedElement: HTMLElement;
    public monthName: string;
    public year: string;
    private subscription: Subscription;
    private time: Date = new Date(0, 0, 0, 0, 0, 0);

    constructor(private translate: TranslateService) {
    }

    public ngOnInit(): void {
        this.recalculateMonth();

        this.subscription = this.translate.onLangChange.subscribe(() => {
            this.recalculateMonth();
        });
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
            if (this.dateBlock &&
                ((this.dateBlock.direction === 'forward' && moment(date).isSameOrAfter(this.dateBlock.date))
                    || (this.dateBlock.direction === 'backward' && moment(date).isSameOrBefore(this.dateBlock.date)))) {
                this.thisMonth.push({
                    date,
                    weekDay: this.getDayOfWeek(date),
                    weekOfMonth: this.getWeekNumber(date),
                    color: 'white',
                    disabled: true,
                });
            } else {
                if (this.selectedDate && date.getTime() === this.selectedDate.getTime()) {
                    this.thisMonth.push({
                        date,
                        weekDay: this.getDayOfWeek(date),
                        weekOfMonth: this.getWeekNumber(date),
                        color: 'lightblue',
                    });
                } else {
                    this.thisMonth.push({
                        date,
                        weekDay: this.getDayOfWeek(date),
                        weekOfMonth: this.getWeekNumber(date),
                        color: 'white',
                    });
                }
            }
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

    /**
     * Выделяет выбраную дату, при выборе второй даты отправляет интервал.
     */
    public selectDate(date: Date, event): void {
        if (!this.selectedElement) {
            this.selectedDate = date;
            this.selectedElement = event.target;
            this.selectedElement.classList.add('selected-date');
        } else {
            this.selectedDate = date;
            this.selectedElement.classList.remove('selected-date');
            this.selectedElement = event.target;
            this.selectedElement.classList.add('selected-date');
        }
        date.setHours(this.time.getHours(), this.time.getMinutes(), this.time.getSeconds());
        this.onSelectDate.emit(date);
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
            this.selectedDate = new Date();
        }
        this.selectedDate.setHours(this.time.getHours(), this.time.getMinutes(), this.time.getSeconds());
        this.onSelectDate.emit(this.selectedDate);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dateBlock) {
            this.recalculateMonth();
        }
    }
}
