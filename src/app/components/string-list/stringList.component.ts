import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,} from '@angular/core';
import {StringsService} from '../../services/strings/strings.service';
import {Subscription} from 'rxjs';
import {now, forEach, filter, remove} from 'lodash'
import {StringListItem} from './models/StringListItem';
import {Statuses} from '../status/statuses';
import {StringsFilterService} from '../../services/strings-filter/stringsFilter.service';


@Component({
    selector: 'strings-list',
    templateUrl: './stringList.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringList implements OnDestroy {
    subscription: Subscription;
    stringListItems: StringListItem[] = [];
    filteredStringListItems: StringListItem[] = [];
    filterItem: any = {};
    interval: number = 0;

    constructor(private stringService: StringsService, private changeDetector: ChangeDetectorRef, private filterService: StringsFilterService) {
        this.subscription = stringService.getObservable().subscribe(stringListItem => {
            this.stringListItems.push(stringListItem);
            changeDetector.markForCheck();
            this.filter();
        });

        this.subscription.add(filterService.getObservable().subscribe(filterItem => {
            this.filterItem = filterItem;
            changeDetector.markForCheck();
            this.filter();
        }))
    }

    /**
     * Удаляет строку из списка.
     * @param {number} index Индекс удаляемой строки в списке.
     */
    deleteItem(index: number): void {
        remove(this.stringListItems, (item) => {
            return item == this.filteredStringListItems[index];
        });
        if (this.filterItem.text || this.filterItem.status) {
            this.filteredStringListItems.splice(index, 1);
        }
    }

    /**
     * Фильрует массив элементов StringListItem согласно данным для фильтрации, выводит их и останавливает интервал,
     * если данные для фильтрации отсутствуют то запускает интервал и выводит весь список.
     */
    filter(): void {
        if (this.filterItem.text && this.filterItem.status) {
            clearInterval(this.interval);
            this.interval = 0;
            this.filteredStringListItems = filter(this.stringListItems, item => {
                return item.text.includes(this.filterItem.text) && item.status === this.filterItem.status;
            })
        } else if (this.filterItem.text || this.filterItem.status) {
            clearInterval(this.interval);
            this.interval = 0;
            this.filteredStringListItems = filter(this.stringListItems, item => {
                return item.text.includes(this.filterItem.text) || item.status === this.filterItem.status;
            })
        } else {
            this.filteredStringListItems = this.stringListItems;
            if (this.interval === 0) {
                this.interval = this.countdown();
            }
        }
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
            forEach(this.filteredStringListItems, item => {
                let timeDifference = currentTime - item.date;
                if (timeDifference > 60000 && item.status !== Statuses.ROTTEN) {
                    item.status = Statuses.ROTTEN;
                    this.changeDetector.markForCheck();
                } else if (timeDifference > 30000 && timeDifference < 60000 && item.status !== Statuses.YESTERDAY) {
                    item.status = Statuses.YESTERDAY;
                    this.changeDetector.markForCheck();
                }
                if (item.status === Statuses.ROTTEN) rottenCounter++;
            });
            if (this.filteredStringListItems.length === rottenCounter) {
                clearInterval(this.interval);
                this.interval = 0;
            }
        }, 1000)
    }
}




