import {Component, OnDestroy,} from '@angular/core';
import {StringsService} from '../../services/strings.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'strings-list',
    templateUrl: './stringList.template.html',
})
export class StringList implements OnDestroy {
    subscription: Subscription;
    strings: string[] = [];

    constructor(private stringService: StringsService) {
        this.subscription = stringService.getObservable().subscribe(string => {
            this.strings.push(string)
        });
    }

    /**
     * Удаляет строку из списка.
     * @param {number} index Индекс удаляемой строки в списке.
     */
    deleteItem(index: number): void {
        this.strings.splice(index, 1);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
};


