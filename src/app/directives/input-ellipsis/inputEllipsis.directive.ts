import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
    selector: '[input-ellipsis]',
})
export class InputEllipsisDirective {
    constructor(public renderer: Renderer2, public elementRef: ElementRef) {
        this.renderer.setAttribute(this.elementRef.nativeElement,
            'readonly', 'readonly');
    }

    @HostListener('click', ['$event'])
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
