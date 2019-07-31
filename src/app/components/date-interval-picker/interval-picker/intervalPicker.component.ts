import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import config from 'app/config.json';
import {DisableDirections} from 'app/enums/disableDirections.enum';
import moment from 'moment';

const DATE_FORMAT: string = config.DATE.DATE_FORMAT;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'interval-picker',
    templateUrl: './intervalPicker.template.html',
})
export class IntervalPickerComponent implements OnInit {
    @Output() public onSelectDate = new EventEmitter();
    @Input() public initialInterval: string;

    public firstDate: Date;
    public secondDate: Date;
    public dateRange: string;
    public firstDisabledDates: any;
    public secondDisabledDates: any;

    constructor(private changeDetector: ChangeDetectorRef) {
    }

    /**
     * Выбор даты в первом дата пикере.
     */
    public selectFirstDate(date): void {
        if (this.secondDate) {
            this.dateRange = this.createTimeInterval(date, this.secondDate);
            this.onSelectDate.emit(this.dateRange);
        }
        this.firstDate = date;
        this.firstDisabledDates = {date, direction: DisableDirections.BACKWARD};
        this.changeDetector.markForCheck();
    }

    /**
     * Выбор даты во втором дата пикере.
     */
    public selectSecondDate(date): void {
        if (this.firstDate) {
            this.dateRange = this.createTimeInterval(this.firstDate, date);
            this.onSelectDate.emit(this.dateRange);
        }
        this.secondDate = date;
        this.secondDisabledDates = {date, direction: DisableDirections.FORWARD};
        this.changeDetector.markForCheck();
    }

    /**
     * Создает интервал из 2-х дат, если вторая дата меньше чем первая то меняет их местами в интервале.
     */
    public createTimeInterval(firstDate: Date, secondDate: Date): any {
        return `${moment(firstDate.getTime()).format(DATE_FORMAT)} - `
            + `${moment(secondDate.getTime()).format(DATE_FORMAT)}`;
    }

    public ngOnInit(): void {
        this.parseDateInterval(this.initialInterval);
    }

    /**
     * Парсит строку содержащую интервал из 2-х дат.
     */
    public parseDateInterval(timeInterval: string): any {
        if (timeInterval) {
            const interval: string[] = timeInterval.split(' - ');
            if (moment(interval[0], DATE_FORMAT).toDate() < moment(interval[1], DATE_FORMAT).toDate()) {
                this.firstDate = moment(interval[0], DATE_FORMAT).toDate();
                this.secondDate = moment(interval[1], DATE_FORMAT).toDate();
                this.firstDisabledDates = {
                    date: moment(interval[0], DATE_FORMAT).toDate(),
                    direction: DisableDirections.BACKWARD,
                };
                this.secondDisabledDates = {
                    date: moment(interval[1], DATE_FORMAT).toDate(),
                    direction: DisableDirections.FORWARD,
                };
            }
        } else {
            this.resetDates();
        }
        this.changeDetector.markForCheck();
    }

    /**
     * Сбросить интервал дат.
     */
    public reset() {
        this.resetDates();
        this.onSelectDate.emit('');
    }

    /**
     * Сбросить интервал дат.
     */
    public resetDates() {
        this.firstDate = undefined;
        this.secondDate = undefined;
        this.secondDisabledDates = {};
        this.firstDisabledDates = {};
    }
}
