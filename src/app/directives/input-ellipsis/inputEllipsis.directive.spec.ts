import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {InputEllipsisDirective} from './inputEllipsis.directive';

@Component({
    template: `<input input-ellipsis>`,
})
class TestComponent {
}

describe('input ellipsis directive', function() {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [TestComponent, InputEllipsisDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
    });

    it('check is element readonly when blurred and not readonly when clicked', function() {
        const testElem = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(testElem.getAttribute('readonly')).toBe('readonly');

        testElem.dispatchEvent(new MouseEvent('mousedown'));

        expect(testElem.getAttribute('readonly')).toBe(null);

        testElem.dispatchEvent(new Event('blur'));

        expect(testElem.getAttribute('readonly')).toBe('readonly');
    });
});
