import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';
import {ResizeEdges} from 'app/enums/resizeEdges.enum';

@Directive({
    selector: '[resizable]',
})
export class ResizableDirective {
    private start: HTMLElement;
    private pressed: boolean;
    private startX: any;
    private startWidth: any;
    private mouseMove: () => void;
    private mouseUp: () => void;
    private element;
    private resizeEdge: ResizeEdges;

    @Output() public onResize = new EventEmitter();
    @Output() public onResizeEnd = new EventEmitter();
    @Input() public isResizable: boolean;
    @Input() public resizeEdges: any;

    public constructor(public renderer: Renderer2, public elementRef: ElementRef) {
        this.element = this.elementRef.nativeElement;
    }

    /**
     * Отслеживает событие mousedown на элементе, если произошло событие mousedown то через 500 милисекунд позволяет
     * перетаскивать элемент.
     * @param event
     */
    @HostListener('mousedown', ['$event'])
    public onMouseDown(event): void {
        if (this.isResizable) {
            const rect: DOMRect = this.element.getBoundingClientRect();
            event.stopPropagation();
            this.start = event.target;
            this.pressed = true;
            this.startX = event.pageX;
            this.startWidth = this.start.parentElement.offsetWidth;
            if (this.resizeEdges.right && (event.pageX <= rect.right && event.pageX >= rect.right - 10
                && event.pageY >= rect.top && event.pageY <= rect.bottom)) {
                this.resizeEdge = ResizeEdges.RIGHT;
                this.initListeners();
            } else if (this.resizeEdges.left && (event.pageX >= rect.left && event.pageX <= rect.left + 10
                && event.pageY >= rect.top && event.pageY <= rect.bottom)) {
                this.resizeEdge = ResizeEdges.LEFT;
                this.initListeners();
            }
        }
    }

    @HostListener('mousemove', ['$event'])
    public onMouseMove(event): void {
        if (this.isResizable) {
            const rect: DOMRect = this.element.getBoundingClientRect();
            if ((this.resizeEdges.right && (event.pageX <= rect.right && event.pageX >= rect.right - 10
                && event.pageY >= rect.top && event.pageY <= rect.bottom))
                || (this.resizeEdges.left && (event.pageX >= rect.left && event.pageX <= rect.left + 10
                    && event.pageY >= rect.top && event.pageY <= rect.bottom))) {
                this.renderer.addClass(this.element, 'resizable');
            } else {
                this.renderer.removeClass(this.element, 'resizable');
            }
        }
    }

    /**
     * Отслеживает перемещения мыши после нажатия на границе колонки и изменяет ширину колонок в шапке.
     */
    private initListeners() {
        let width: number;
        this.mouseMove = this.renderer.listen('body', 'mousemove', (event) => {
                if (this.pressed) {
                    const diff = (event.pageX - this.startX);
                    if (this.resizeEdge === ResizeEdges.RIGHT) {
                        width = this.startWidth + diff;
                    } else {
                        width = this.startWidth - diff;
                    }
                    this.onResize.emit({width, resizeEdge: this.resizeEdge});
                }
            },
        );
        this.mouseUp = this.renderer.listen('body', 'mouseup', () => {
            if (this.pressed) {
                this.onResizeEnd.emit();
                this.pressed = false;
                this.mouseMove();
                this.mouseUp();
            }
        });
    }
}
