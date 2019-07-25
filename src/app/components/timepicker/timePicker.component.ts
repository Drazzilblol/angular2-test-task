import {ChangeDetectionStrategy, Component} from '@angular/core';
import moment from 'moment';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'time-picker',
    templateUrl: './timePicker.template.html',
})
export class TimePickerComponent {
    public currentDate: moment.Moment = moment();
    public hours: number = this.currentDate.hour().valueOf();
    public minutes: number = this.currentDate.minute().valueOf();
    public seconds: number = this.currentDate.second().valueOf();

    /**
     * Переходит на следующий месяц.
     */
    public nextHour(): void {
        this.currentDate.add(1, 'hour');
        this.hours = this.currentDate.hour().valueOf();
    }

    /**
     * Переходит на предыдущий месяц.
     */
    public previousHour(): void {
        this.currentDate.add(-1, 'hour');
        this.hours = this.currentDate.hour().valueOf();
    }

    /**
     * Переходит на следующий месяц.
     */
    public nextMinute(): void {
        this.currentDate.add(1, 'minute');
        this.minutes = this.currentDate.minute().valueOf();
    }

    /**
     * Переходит на предыдущий месяц.
     */
    public previousMinute(): void {
        this.currentDate.add(-1, 'minute');
        this.minutes = this.currentDate.minute().valueOf();
    }

    /**
     * Переходит на следующий месяц.
     */
    public nextSecond(): void {
        this.currentDate.add(1, 'second');
        this.seconds = this.currentDate.second().valueOf();
    }

    /**
     * Переходит на предыдущий месяц.
     */
    public previousSecond(): void {
        this.currentDate.add(-1, 'second');
        this.seconds = this.currentDate.second().valueOf();
    }

}
