import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

/**
 * Директива для текстовго input, которая при потере фокуса добавляет элементу атрибут readonly а при клике на элемент
 * убирает атрибут readonly. Необходима для работы text-overflow: ellipsis в input на IE.
 */
@Directive({
    selector: '[input-ellipsis]',
})
export class InputEllipsisDirective {
    constructor(public renderer: Renderer2, public elementRef: ElementRef) {
        this.renderer.setAttribute(this.elementRef.nativeElement,
            'readonly', 'readonly');
    }

    @HostListener('mousedown', ['$event'])
    public onClick(): void {
        this.renderer.removeAttribute(this.elementRef.nativeElement,
            'readonly');
    }

    @HostListener('blur', ['$event'])
    public onBlur(): void {
        this.renderer.setAttribute(this.elementRef.nativeElement,
            'readonly', 'readonly');
    }
}
