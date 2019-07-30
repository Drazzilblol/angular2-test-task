import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import moment from 'moment';

const DATE_FORMAT: string = 'DD-MM-YYYY HH:mm:ss';

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
    public firstDateBlock: any;
    public secondDateBlock: any;

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
        this.firstDateBlock = {date, direction: 'backward'};
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
        this.secondDateBlock = {date, direction: 'forward'};
        this.changeDetector.markForCheck();
    }

    /**
     * Создает интервал из 2-х дат, если вторая дата меньше чем первая то меняет их местами в интервале.
     */
    public createTimeInterval(firstDate: Date, secondDate: Date): any {
        return `${moment(firstDate.getTime()).format('DD-MM-YYYY HH:mm:ss')} - `
            + `${moment(secondDate.getTime()).format('DD-MM-YYYY HH:mm:ss')}`;
    }

    public ngOnInit(): void {
        this.parseTimeInterval(this.initialInterval);
    }

    /**
     * Парсит строку содержащую интервал из 2-х дат.
     */
    public parseTimeInterval(timeInterval: string): any {
        if (timeInterval) {
            const interval: string[] = timeInterval.split(' - ');
            if (moment(interval[0], DATE_FORMAT).toDate() < moment(interval[1], DATE_FORMAT).toDate()) {
                this.firstDate = moment(interval[0], DATE_FORMAT).toDate();
                this.secondDate = moment(interval[1], DATE_FORMAT).toDate();
                this.firstDateBlock = {date: moment(interval[0], DATE_FORMAT).toDate(), direction: 'backward'};
                this.secondDateBlock = {date: moment(interval[1], DATE_FORMAT).toDate(), direction: 'forward'};
            }
        } else {
            this.firstDate = undefined;
            this.secondDate = undefined;
            this.secondDateBlock = {};
            this.firstDateBlock = {};
        }
        this.changeDetector.markForCheck();
    }

    /**
     * Создает интервал из 2-х дат, если вторая дата меньше чем первая то меняет их местами в интервале.
     */
    public reset() {
        this.firstDate = undefined;
        this.secondDate = undefined;
        this.secondDateBlock = {};
        this.firstDateBlock = {};
        this.onSelectDate.emit('');
    }
}
