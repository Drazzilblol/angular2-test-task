import {ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {DateTimePickerComponent} from 'app/components/date-time-picker/dateTimePicker.component';

@Injectable()
export class DatePickerManagerService {

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    public open(container: ViewContainerRef): DateTimePickerComponent {
        container.clear();
        const factory = this.componentFactoryResolver.resolveComponentFactory(DateTimePickerComponent);
        const componentRef: ComponentRef<DateTimePickerComponent> = container.createComponent(factory);
        componentRef.location.nativeElement.style.left = `${container.element.nativeElement.offsetLeft}px`;
        componentRef.location.nativeElement.style.top
            = `${container.element.nativeElement.getBoundingClientRect().height + 6}px`;
        return componentRef.instance;
    }

    public close(container: ViewContainerRef) {
        container.remove(0);
    }
}
