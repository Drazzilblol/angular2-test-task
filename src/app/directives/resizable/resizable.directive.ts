import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';
import {ResizeEdges} from 'app/enums/resizeEdges.enum';

const RESIZE_EDGES_WIDTH: number = 10;

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
    private element: any;
    private resizeEdge: ResizeEdges;

    /**
     * Событие изменения размера элемента.
     */
    @Output() public onResize = new EventEmitter();

    /**
     * Событие окончание изменения размера элемента.
     */
    @Output() public onResizeEnd = new EventEmitter();

    /**
     * Разрешение на изменение размера элемента.
     */
    @Input() public isResizable: boolean = false;

    /**
     * Объект который содержит список границ элемента с помощью которых разрешено изменять его размер.
     * Может содержать свойства left и right типа boolean.
     */
    @Input() public resizeEdges: any = {};

    public constructor(public renderer: Renderer2, public elementRef: ElementRef) {
        this.element = this.elementRef.nativeElement;
    }

    /**
     * Отслеживает событие mousedown на элементе, если событие произошло на границе элемента, то запускате отслеживание
     * движения курсора.
     * @param event
     */
    @HostListener('mousedown', ['$event'])
    public onMouseDown(event): void {
        if (this.isResizable) {
            const rect: DOMRect = this.element.getBoundingClientRect();
            if (event.pageX >= rect.right - RESIZE_EDGES_WIDTH && this.resizeEdges.right) {
                this.resizeEdge = ResizeEdges.RIGHT;
                this.initResizing(event, rect);
            } else if (event.pageX <= rect.left + RESIZE_EDGES_WIDTH && this.resizeEdges.left) {
                this.resizeEdge = ResizeEdges.LEFT;
                this.initResizing(event, rect);
            }
        }
    }

    public initResizing(event, rect: DOMRect): void {
        event.stopPropagation();
        this.start = event.target;
        this.startX = event.pageX;
        this.startWidth = rect.width;
        this.pressed = true;
        this.initListeners();
    }

    /**
     * Отслеживает событие mousemove на элементе, если событие произошло на краю элемента, то изменяет курсор
     * на col-resize.
     * @param event
     */
    @HostListener('mousemove', ['$event'])
    public onMouseMove(event): void {
        if (this.isResizable) {
            const rect: DOMRect = this.element.getBoundingClientRect();
            if ((event.pageX >= rect.right - RESIZE_EDGES_WIDTH && this.resizeEdges.right)
                || (event.pageX <= rect.left + RESIZE_EDGES_WIDTH && this.resizeEdges.left)) {
                this.renderer.addClass(this.element, 'resizable');
            } else {
                this.renderer.removeClass(this.element, 'resizable');
            }
        }
    }

    /**
     * Отслеживает перемещения мыши после нажатия на границе элемента и изменяет его ширину.
     */
    private initListeners() {
        let width: number;
        this.mouseMove = this.renderer.listen('body', 'mousemove', (event) => {
                if (this.pressed) {
                    const diff = event.pageX - this.startX;
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
