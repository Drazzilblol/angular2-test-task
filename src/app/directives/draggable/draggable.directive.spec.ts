import {Component} from '@angular/core';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DraggableDirective} from './draggable.directive';

@Component({
    template: `
        <div draggable [isDraggable]="true"></div>`,
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
        const testElem = fixture.debugElement.query(By.css('div')).nativeElement;
        const dragX: number = 300;
        testElem.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            clientX: testElem.getBoundingClientRect().x,
        }));
        tick(1000);
        expect(testElem.classList.contains('draggable')).toBe(true);

        const event = new MouseEvent('mousemove', {
            bubbles: true,
            clientX: dragX,
        });
        testElem.dispatchEvent(event);

        expect(testElem.style.left).toBe(dragX - testElem.getBoundingClientRect().x + 'px');

        testElem.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
        }));

        expect(testElem.classList.contains('draggable')).toBe(false);
    }));
});
