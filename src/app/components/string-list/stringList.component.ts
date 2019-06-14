import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy,} from '@angular/core';
import {StringsService} from '../../services/strings/strings.service';
import {Subscription} from 'rxjs';
import {now, forEach, remove} from 'lodash'
import {StringListItem} from './models/StringListItem';
import {Statuses} from '../../enums/statuses.enum';
import {StringsFilterService} from '../../services/strings-filter/stringsFilter.service';
import {StringsHttpService} from "../../services/getStrings/stringsHttp.service";
import {FilterParams} from "../filter/models/filterParams";

@Component({
    selector: 'strings-list',
    templateUrl: './stringList.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        }))
    }

    /**
     * Удаляет строку из списка.
     * @param {number} date Время созания удаляемой строки в списке.
     */
    deleteItem(date: number): void {
        remove(this.stringListItems, (item) => {
            return item.date === date;
        });
    }

    /**
     * Сбразывает статус элемента, изменяет время создания на текущее.
     * @param {number} date Время созания удаляемой строки в списке.
     */
    resetItemStatus(date: number): void {
        forEach(this.stringListItems, (item) => {
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
                let isStatusChanged: boolean = false;
                forEach(this.stringListItems, item => {
                    if (item.status === Statuses.ROTTEN) {
                        rottenCounter++;
                        return;
                    }
                    let timeDifference = currentTime - item.date;
                    if (timeDifference > 60000) {
                        item.status = Statuses.ROTTEN;
                        isStatusChanged = true;
                        rottenCounter++;
                    } else if (timeDifference > 30000 && timeDifference < 60000 && item.status !== Statuses.YESTERDAY) {
                        item.status = Statuses.YESTERDAY;
                        isStatusChanged = true;
                    }
                });
                if (isStatusChanged) this.changeDetector.markForCheck();
                if (this.stringListItems.length === rottenCounter) {
                    clearInterval(this.interval);
                    this.interval = 0;
                }
            }, 1000)
        }
    }
}




