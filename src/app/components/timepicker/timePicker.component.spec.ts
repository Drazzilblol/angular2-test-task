import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TimePickerComponent} from 'app/components/timepicker/timePicker.component';
import {Subscription} from 'rxjs';

describe('time picker', function() {
    let component: TimePickerComponent;
    let fixture: ComponentFixture<TimePickerComponent>;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [TimePickerComponent],
            imports: [NgbTooltipModule, ReactiveFormsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(TimePickerComponent);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        fixtureDebug = null;
    });

    it('check enter time in input', function() {
        const testValue = 10;
        const subscription: Subscription = new Subscription();

        subscription.add(component.onChangeTime.subscribe((date: Date) => {
            expect(date.getHours()).toBe(testValue);
        }));

        const inputs = fixtureDebug.queryAll(By.css('input'));
        inputs[0].nativeElement.value = testValue;
        inputs[0].nativeElement.dispatchEvent(new Event('input', {
            bubbles: true,
        }));

        subscription.add(component.onChangeTime.subscribe((date: Date) => {
            expect(date.getMinutes()).toBe(testValue);
        }));

        inputs[1].nativeElement.value = testValue;
        inputs[1].nativeElement.dispatchEvent(new Event('input', {
            bubbles: true,
        }));

        subscription.add(component.onChangeTime.subscribe((date: Date) => {
            expect(date.getSeconds()).toBe(testValue);
        }));

        inputs[2].nativeElement.value = testValue;
        inputs[2].nativeElement.dispatchEvent(new Event('input', {
            bubbles: true,
        }));
    });

    it('check click time buttons', function() {
        let subscription: Subscription = component.onChangeTime.subscribe((date: Date) => {
            expect(date.getHours()).toBe(1);
        });
        const buttons = fixtureDebug.queryAll(By.css('i'));
        buttons[0].nativeElement.dispatchEvent(new Event('click'));
        subscription.unsubscribe();

        subscription = component.onChangeTime.subscribe((date: Date) => {
            expect(date.getHours()).toBe(0);
        });
        buttons[1].nativeElement.dispatchEvent(new Event('click'));
        subscription.unsubscribe();

        subscription = component.onChangeTime.subscribe((date: Date) => {
            expect(date.getMinutes()).toBe(1);
        });
        buttons[2].nativeElement.dispatchEvent(new Event('click'));
        subscription.unsubscribe();

        subscription = component.onChangeTime.subscribe((date: Date) => {
            expect(date.getMinutes()).toBe(0);
        });
        buttons[3].nativeElement.dispatchEvent(new Event('click'));
        subscription.unsubscribe();

        subscription = component.onChangeTime.subscribe((date: Date) => {
            expect(date.getSeconds()).toBe(1);
        });
        buttons[4].nativeElement.dispatchEvent(new Event('click'));
        subscription.unsubscribe();

        subscription = component.onChangeTime.subscribe((date: Date) => {
            expect(date.getSeconds()).toBe(0);
        });
        buttons[5].nativeElement.dispatchEvent(new Event('click'));
        subscription.unsubscribe();
    });
});
