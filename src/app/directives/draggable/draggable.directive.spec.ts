import {Component} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DraggableDirective} from './draggable.directive';

@Component({
    template: `<input draggable [isDraggable]="true">`,
})
class TestComponent {
}

describe('long click directive', function() {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [TestComponent, DraggableDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
    });

    it('check dragging', fakeAsync(function() {
        const testElem = fixture.debugElement.query(By.css('input')).nativeElement;
        testElem.dispatchEvent(new MouseEvent('mousedown'));
        tick(1000);

        expect(testElem.classList.contains('draggable')).toBe(true);

        const event = new MouseEvent('mousemove', {
            bubbles: true,
            clientX: 300,
        });
        testElem.dispatchEvent(event);

        testElem.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
        }));

        expect(testElem.classList.contains('draggable')).toBe(false);
    }));
});
