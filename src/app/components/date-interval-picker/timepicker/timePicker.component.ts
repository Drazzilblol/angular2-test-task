import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import moment from 'moment';
import {fromEvent, Subscription} from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'time-picker',
    templateUrl: './timePicker.template.html',
})
export class TimePickerComponent implements OnInit, OnDestroy, OnChanges {
    @Output() public onChangeTime = new EventEmitter();
    @Input() public initialTime: Date;
    public currentDate: moment.Moment = moment(new Date(0, 0, 0, 0, 0, 0));
    private timeForm: FormGroup;
    private subscription: Subscription;

    constructor(private elementRef: ElementRef) {
    }

    public ngOnInit(): void {
        this.initTime();
        this.subscription = fromEvent(this.elementRef.nativeElement, 'input')
            .subscribe(() => {
                if (this.timeForm.valid) {
                    this.emitTime();
                }
            });
    }

    /**
     * Инициализирует время.
     */
    private initTime() {
        if (this.initialTime) {
            this.currentDate = moment(this.initialTime);
            this.initForm(this.currentDate.hour().toString(),
                this.currentDate.minute().toString(),
                this.currentDate.second().toString());
        } else {
            this.initForm('0', '0', '0');
        }
    }

    /**
     * Инициализирует форму.
     */
    private initForm(hour: string, minute: string, second: string) {
        this.timeForm = new FormGroup({
            hours: new FormControl(hour, [Validators.required, Validators.max(23), Validators.min(0)]),
            minutes: new FormControl(minute, [Validators.required, Validators.max(59), Validators.min(0)]),
            seconds: new FormControl(second, [Validators.required, Validators.max(59), Validators.min(0)]),
        });
    }

    /**
     * Изменяет время.
     */
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

    public ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.initialTime && this.timeForm && !this.initialTime) {
            this.currentDate.hour(0);
            this.currentDate.minute(0);
            this.currentDate.second(0);
            this.timeForm.controls.hours.setValue('0');
            this.timeForm.controls.minutes.setValue('0');
            this.timeForm.controls.seconds.setValue('0');
        }
    }
}
