import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';
import {Subscription, timer} from 'rxjs';

@Directive({
    selector: '[draggable]',
})
export class DraggableDirective {
    @Output() public longClickEnd = new EventEmitter();
    @Output() public longClickStart = new EventEmitter();
    @Input() public isDraggable: boolean;
    private mouseMove: () => void;
    private mouseUp: () => void;
    private x: number;
    private offsetX: number;
    private target;
    private element;
    public timerSub: Subscription;

    public constructor(public renderer: Renderer2, public elementRef: ElementRef) {
        this.element = this.elementRef.nativeElement;
    }

    @HostListener('mousedown', ['$event'])
    public clickStart(event): void {
        if (this.isDraggable) {
            this.timerSub = timer(500).subscribe(() => {
                this.x = event.pageX;
                this.offsetX = event.offsetX;
                this.target = event.target;
                this.renderer.addClass(this.element, 'draggable');
                this.longClickStart.emit();
                this.initListeners();
            });
        }
    }

    @HostListener('mouseup', ['$event'])
    public clickEnd(): void {
        if (this.isDraggable) {
            this.longClickEnd.emit();
            if (this.timerSub) {
                this.timerSub.unsubscribe();
            }
        }
    }

    private initListeners() {
        this.mouseMove = this.renderer.listen('body', 'mousemove', (event) => {
                this.move(event);
            },
        );
        this.mouseUp = this.renderer.listen('body', 'mouseup', () => {
                this.endMove();
            },
        );
    }

    public move(event: MouseEvent) {
        this.renderer.setStyle(this.element, 'left',
            `${event.pageX - this.x + this.offsetX}px`);

    }

    public endMove() {
        this.renderer.removeStyle(this.element, 'left');
        this.renderer.removeClass(this.element, 'draggable');
        if (this.timerSub) {
            this.timerSub.unsubscribe();
        }
        this.mouseMove();
        this.mouseUp();
    }
}
