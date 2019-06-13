import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,} from '@angular/core';
import {StringsService} from '../../services/strings/strings.service';
import {Subscription} from 'rxjs';
import {now, forEach, remove} from 'lodash'
import {StringListItem} from './models/StringListItem';
import {Statuses} from '../status/statuses';
import {StringsFilterService} from '../../services/strings-filter/stringsFilter.service';
import {StringsHttpService} from "../../services/getStrings/stringsHttp.service";
import {FilterParams} from "../filter/models/filterParams";

@Component({
    selector: 'strings-list',
    templateUrl: './stringList.template.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class StringList implements OnDestroy {
    subscription: Subscription;
    stringListItems: StringListItem[] = [];
    filterParams: FilterParams = new FilterParams("", null);
    interval: number = 0;

    constructor(private stringService: StringsService, private changeDetector: ChangeDetectorRef,
                private filterService: StringsFilterService, private getStringsService: StringsHttpService) {

        this.subscription = stringService.getObservable().subscribe(stringListItem => {
            this.stringListItems.push(stringListItem);
            changeDetector.markForCheck();
            this.countdown();
        });

        this.subscription.add(getStringsService.getStrings().subscribe((res: any[]) => {
            res.forEach(item => {
                this.stringListItems.push(new StringListItem(item.text, item.date, item.status));
            });
            changeDetector.markForCheck();
            this.countdown();

        }));

        this.subscription.add(filterService.getObservable().subscribe(filterParams => {
            this.filterParams = filterParams;
            changeDetector.markForCheck();
            if (this.filterParams.text || this.filterParams.status) {
                clearInterval(this.interval);
                this.interval = 0;
            }
        }))
    }

    /**
     * Удаляет строку из списка.
     * @param {number} date Время созания удаляемой строки в списке.
     * @param {StringListItem[]} filteredList Отфильтрованый список.
     */
    deleteItem(date: number, filteredList: StringListItem[]): void {
        remove(this.stringListItems, (item) => {
            return item.date === date;
        });
        remove(filteredList, (item) => {
            return item.date === date;
        });
    }

    /**
     * Сбразывает статус элемента, изменяет время создания на текущее.
     * @param {number} date Время созания удаляемой строки в списке.
     * @param {StringListItem[]} filteredList Отфильтрованый список.
     */
    resetItemStatus(date: number, filteredList: StringListItem[]): void {
        forEach(this.stringListItems, (item) => {
            if (item.date === date) {
                item.date = now();
                item.status = Statuses.FRESH
            }
        });
        forEach(filteredList, (item) => {
            if (item.date === date) {
                item.date = now();
                item.status = Statuses.FRESH
            }
        });
        this.countdown();
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
    countdown(): void {
        if (this.interval === 0) {
            this.interval = window.setInterval(() => {
                let currentTime: number = now();
                let rottenCounter: number = 0;
                forEach(this.stringListItems, item => {
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
                if (this.stringListItems.length === rottenCounter) {
                    clearInterval(this.interval);
                    this.interval = 0;
                }
            }, 1000)
        }
    }
}




