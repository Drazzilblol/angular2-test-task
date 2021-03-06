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
    @Output() public onSelectDates = new EventEmitter();
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
    public selectFirstDate(date: Date): void {
        if (this.secondDate) {
            this.dateRange = this.createDateInterval(date, this.secondDate);
            this.onSelectDates.emit(this.dateRange);
        }
        this.firstDate = date;
        this.firstDisabledDates = {date, direction: DisableDirections.BACKWARD};
    }

    /**
     * Выбор даты во втором дата пикере.
     */
    public selectSecondDate(date: Date): void {
        if (this.firstDate) {
            this.dateRange = this.createDateInterval(this.firstDate, date);
            this.onSelectDates.emit(this.dateRange);
        }
        this.secondDate = date;
        this.secondDisabledDates = {date, direction: DisableDirections.FORWARD};
    }

    /**
     * Создает интервал из 2-х дат.
     */
    public createDateInterval(firstDate: Date, secondDate: Date): any {
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
            const days: string[] = timeInterval.split(' - ');
            this.firstDate = moment(days[0], DATE_FORMAT).toDate();
            this.secondDate = moment(days[1], DATE_FORMAT).toDate();
            this.firstDisabledDates = {
                date: this.firstDate,
                direction: DisableDirections.BACKWARD,
            };
            this.secondDisabledDates = {
                date: this.secondDate,
                direction: DisableDirections.FORWARD,
            };
        } else {
            this.reset();
        }
        this.changeDetector.markForCheck();
    }

    /**
     * Сбросить интервал дат.
     */
    public resetPicker() {
        this.reset();
        this.onSelectDates.emit('');
    }

    /**
     * Сбросить интервал дат.
     */
    public reset() {
        this.firstDate = null;
        this.secondDate = null;
        this.secondDisabledDates = null;
        this.firstDisabledDates = null;
    }
}
