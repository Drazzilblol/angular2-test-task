import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,} from '@angular/core';
import {StringsService} from '../../services/strings.service';
import {Subscription} from 'rxjs';
import {now, forEach} from 'lodash'
import {StringListItem} from './models/StringListItem';

@Component({
    selector: 'strings-list',
    templateUrl: './stringList.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringList implements OnDestroy {
    subscription: Subscription;
    stringListItems: StringListItem[] = [];
    interval: number = 0;

    constructor(private stringService: StringsService, private changeDetector: ChangeDetectorRef) {
        this.subscription = stringService.getObservable().subscribe(stringListItem => {
            this.stringListItems.push(stringListItem);
            changeDetector.detectChanges();
            if (this.interval === 0) {
                this.interval = this.countdown();
            }
        });
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
        clearInterval(this.interval);
    }

    /**
     * Раз в секунду сравнивает текущее время и время добавления всех элементов списка,
     * если прошло достаточно времени изменяет статус элемента, после того как все элементы
     * получили статус ROTTEN, интервал останавливается.
     * @return {number} Возвращает номер интервала.
     */
    countdown(): number {
        return window.setInterval(() => {
            let currentTime: number = now();
            let rottenCounter: number = 0;
            forEach(this.stringListItems, item => {
                if (currentTime - item.date > 60000 && item.status !== 'ROTTEN') {
                    item.status = 'ROTTEN';
                    this.changeDetector.detectChanges();
                } else if (currentTime - item.date > 30000 && currentTime - item.date < 60000 && item.status !== 'YESTERDAY') {
                    item.status = 'YESTERDAY';
                    this.changeDetector.detectChanges();
                }

                if (item.status === 'ROTTEN') rottenCounter++;
            });
            if (this.stringListItems.length === rottenCounter) {
                clearInterval(this.interval);
                this.interval = 0;
            }
        }, 1000)
    }
}




