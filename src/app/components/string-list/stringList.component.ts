import {ChangeDetectionStrategy, Component, OnDestroy,} from '@angular/core';
import {StringsService} from '../../services/strings.service';
import {Subscription} from 'rxjs';
import {now, forEach} from 'lodash'
import {StringListItem} from './models/StringListItem';

@Component({
    selector: 'strings-list',
    templateUrl: './stringList.template.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class StringList implements OnDestroy {
    subscription: Subscription;
    stringListItems: StringListItem[] = [];

    constructor(private stringService: StringsService) {
        this.subscription = stringService.getObservable().subscribe(stringListItem => {
            this.stringListItems.push(stringListItem)
        });
        this.countdown();
    }

    /**
     * Удаляет строку из списка.
     * @param {number} index Индекс удаляемой строки в списке.
     */
    deleteItem(index: number): void {
        this.stringListItems.splice(index, 1);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    countdown(): void {
        setInterval(() => {
            let currentTime: number = now();
            forEach(this.stringListItems, item => {
                if (currentTime - item.date > 60000 && item.status !== 'ROTTEN') {
                    item.status = 'ROTTEN';
                } else if (currentTime - item.date > 30000 && currentTime - item.date < 60000 && item.status !== 'YESTERDAY') {
                    item.status = 'YESTERDAY';
                }
            })
        }, 1000)
    }
}




