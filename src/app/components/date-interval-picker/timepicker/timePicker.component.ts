import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import moment from 'moment';
import {fromEvent} from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'time-picker',
    templateUrl: './timePicker.template.html',
})
export class TimePickerComponent implements OnInit {
    @Output() public onChangeTime = new EventEmitter();
    public currentDate: moment.Moment = moment(new Date(0, 0, 0, 0, 0, 0));
    public hours: string = this.currentDate.hour().toString();
    public minutes: string = this.currentDate.minute().toString();
    public seconds: string = this.currentDate.second().toString();
    private timeForm: FormGroup;

    constructor(private elementRef: ElementRef) {
    }

    public ngOnInit(): void {
        this.timeForm = new FormGroup({
            hours: new FormControl(this.hours, [Validators.required, Validators.max(23), Validators.min(0)]),
            minutes: new FormControl(this.minutes, [Validators.required, Validators.max(59), Validators.min(0)]),
            seconds: new FormControl(this.seconds, [Validators.required, Validators.max(59), Validators.min(0)]),
        });

        fromEvent(this.elementRef.nativeElement, 'input')
            .subscribe(() => {
                if (this.timeForm.valid) {
                    this.emitTime();
                }
            });
    }

    public emitTime() {
        this.currentDate.hour(this.timeForm.value.hours)
            .minute(this.timeForm.value.minutes)
            .second(this.timeForm.value.seconds);
        this.onChangeTime.emit(this.currentDate.toDate());
    }

    /**
     * Добавить один час.
     */
    public nextHour(): void {
        this.currentDate.add(1, 'hour');
        this.timeForm.controls.hours.setValue(this.currentDate.hour().toString());
        this.emitTime();
    }

    /**
     * Отнять один часю
     */
    public previousHour(): void {
        this.currentDate.add(-1, 'hour');
        this.timeForm.controls.hours.setValue(this.currentDate.hour().toString());
        this.emitTime();
    }

    /**
     * Добавить одну минутю
     */
    public nextMinute(): void {
        this.currentDate.add(1, 'minute');
        this.timeForm.controls.minutes.setValue(this.currentDate.minute().toString());
        this.emitTime();
    }

    /**
     * Отнять одну минуту.
     */
    public previousMinute(): void {
        this.currentDate.add(-1, 'minute');
        this.timeForm.controls.minutes.setValue(this.currentDate.minute().toString());
        this.emitTime();
    }

    /**
     * Добавить одну секунду.
     */
    public nextSecond(): void {
        this.currentDate.add(1, 'second');
        this.timeForm.controls.seconds.setValue(this.currentDate.second().toString());
        this.emitTime();
    }

    /**
     * Отнять одну секунду.
     */
    public previousSecond(): void {
        this.currentDate.add(-1, 'second');
        this.timeForm.controls.seconds.setValue(this.currentDate.second().toString());
        this.emitTime();
    }
}
