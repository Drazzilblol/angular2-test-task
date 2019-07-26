import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import moment from 'moment';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'interval-picker',
    templateUrl: './intervalPicker.template.html',
})
export class IntervalPickerComponent {
    @Output() public onSelectDate = new EventEmitter();

    public firstDate: Date;
    public secondDate: Date;
    public dateRange = {};

    /**
     * Выбор даты в первом дата пикере.
     */
    public selectFirstDate(date): void {
        if (this.secondDate) {
            this.dateRange = this.createTimeInterval(this.secondDate, date);
            this.onSelectDate.emit(this.dateRange);
            this.firstDate = date;
        } else {
            this.firstDate = date;
        }
    }

    /**
     * Выбор даты во втором дата пикере.
     */
    public selectSecondDate(date): void {
        if (this.firstDate) {
            this.dateRange = this.createTimeInterval(this.firstDate, date);
            this.onSelectDate.emit(this.dateRange);
            this.secondDate = date;
        } else {
            this.secondDate = date;
        }
    }

    /**
     * Создает интервал из 2-х дат, если вторая дата меньше чем первая то меняет их местами в интервале.
     */
    public createTimeInterval(firstDate: Date, secondDate: Date): any {
        if (moment(firstDate).isSameOrBefore(secondDate)) {
            return {firstDate, secondDate};
        } else {
            return {firstDate: secondDate, secondDate: firstDate};
        }
    }
}
