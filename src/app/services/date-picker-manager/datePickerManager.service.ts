import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {DatePickerComponent} from 'app/components/datepicker/datePicker.component';

@Injectable()
export class DatePickerManagerService {

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    public open(container: ViewContainerRef): DatePickerComponent {
        const factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
        const componentRef = container.createComponent(factory);
        return (componentRef.instance as DatePickerComponent);
    }

    public close(container: ViewContainerRef) {
        container.remove(0);
    }
}
