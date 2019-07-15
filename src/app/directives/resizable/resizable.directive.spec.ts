import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ResizeEdges} from 'app/enums/resizeEdges.enum';
import {ResizableDirective} from './resizable.directive';

@Component({
    template: `
        <div style="width: 100px">
            <div style="width: 100px" resizable [isResizable]="true" [resizeEdges]="{left: true, right: true}"
                 (onResize)="onResize($event)" (onResizeEnd)="onResizeEnd()"></div>
        </div>`,
})
class TestComponent {
    public onResize(event) {
    }

    public onResizeEnd() {
    }
}

describe('resizable directive', function() {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [TestComponent, ResizableDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
    });

    it('check resizing', function() {
        const testElem = fixture.debugElement.queryAll(By.css('div'))[1].nativeElement;
        spyOn(component, 'onResize');
        spyOn(component, 'onResizeEnd');
        const expectedWidth: number = 200;
        testElem.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            clientX: testElem.offsetWidth,
            clientY: 10,
        }));

        const event = new MouseEvent('mousemove', {
            bubbles: true,
            clientX: expectedWidth,
        });
        testElem.dispatchEvent(event);

        expect(component.onResize).toHaveBeenCalledWith({width: expectedWidth, resizeEdge: ResizeEdges.RIGHT});

        testElem.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
        }));

        expect(component.onResizeEnd).toHaveBeenCalled();
    });
});
