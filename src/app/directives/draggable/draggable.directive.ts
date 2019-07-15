import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';
import {Subscription, timer} from 'rxjs';

@Directive({
    selector: '[draggable]',
})
export class DraggableDirective {
    @Output() public onDragEnd = new EventEmitter();
    @Output() public onDragStart = new EventEmitter();
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

    /**
     * Отслеживает событие mousedown на элементе, если произошло событие mousedown то через 500 милисекунд позволяет
     * перетаскивать элемент.
     * @param event
     */
    @HostListener('mousedown', ['$event'])
    public clickStart(event): void {
        if (this.isDraggable) {
            this.timerSub = timer(500).subscribe(() => {
                this.x = event.pageX;
                this.offsetX = event.offsetX;
                this.target = event.target;
                this.move(event);
                this.renderer.addClass(this.element, 'draggable');
                this.onDragStart.emit();
                this.initListeners();
            });
        }
    }

    /**
     * Отслеживает событие mouseup на элементе, если произошло событие mouseup то отключает таймер.
     */
    @HostListener('mouseup')
    public clickEnd(): void {
        if (this.isDraggable) {
            this.onDragEnd.emit();
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

    /**
     * При перетаскивании элемента располагает его под курсором.
     */
    public move(event: MouseEvent) {
        this.renderer.setStyle(this.element, 'left',
            `${event.pageX - this.x + this.offsetX}px`);

    }

    /**
     * Убирает возможность перетаскивания элемента.
     */
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
