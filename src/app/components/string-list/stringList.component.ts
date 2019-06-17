import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Statuses} from 'app/enums/statuses.enum';
import {StringsHttpService} from 'app/services/getStrings/stringsHttp.service';
import {StringsFilterService} from 'app/services/strings-filter/stringsFilter.service';
import {StringsService} from 'app/services/strings/strings.service';
import {forEach, now, remove} from 'lodash';
import {Subscription} from 'rxjs';
import {FilterParams} from '../filter/models/filterParams';
import {StringListItem} from './models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'strings-list',
    templateUrl: './stringList.template.html',
})
export class StringList implements OnDestroy {
    public interval: number = 0;
    public filterParams: FilterParams = new FilterParams('', null);
    public subscription: Subscription;
    public stringListItems: StringListItem[] = [];

    constructor(private stringService: StringsService, private changeDetector: ChangeDetectorRef,
                private filterService: StringsFilterService, private getStringsService: StringsHttpService) {

        this.subscription = stringService.getObservable().subscribe((stringListItem) => {
            this.stringListItems.push(stringListItem);
            changeDetector.markForCheck();
            this.countdown();
        });

        this.subscription.add(getStringsService.getStrings().subscribe((res: any[]) => {
            res.forEach((item) => {
                this.stringListItems.push(new StringListItem(item.text, item.date, item.status));
            });
            changeDetector.markForCheck();
            this.countdown();
        }));

        this.subscription.add(filterService.getObservable().subscribe((filterParams) => {
            this.filterParams = filterParams;
            if (filterParams.text || filterParams.status) {
                clearInterval(this.interval);
                this.interval = 0;
            } else {
                this.countdown();
            }
            changeDetector.markForCheck();
        }));
    }

    /**
     * Удаляет строку из списка.
     * @param {string} id Уникальный идентификатор.
     */
    public deleteItem(id: string): void {
        remove(this.stringListItems, (item) => {
            return item.id === id;
        });
    }

    /**
     * Сбразывает статус элемента, изменяет время создания на текущее.
     * @param {string} id Уникальный идентификатор.
     */
    public resetItemStatus(id: string): void {
        forEach(this.stringListItems, (item) => {
            if (item.id === id) {
                item.date = now();
                item.status = Statuses.FRESH;
            }
        });
        this.countdown();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }

    /**
     * Раз в секунду сравнивает текущее время и время добавления всех элементов списка,
     * если прошло достаточно времени изменяет статус элемента, после того как все элементы
     * получили статус ROTTEN, интервал останавливается.
     * @return {number} Возвращает номер интервала.
     */
    public countdown(): void {
        if (this.interval === 0 && !this.filterParams.text && !this.filterParams.status) {
            this.interval = window.setInterval(() => {
                const currentTime: number = now();
                let rottenCounter: number = 0;
                let isStatusChanged: boolean = false;
                forEach(this.stringListItems, (item) => {
                    if (item.status === Statuses.ROTTEN) {
                        rottenCounter++;
                        return;
                    }
                    const timeDifference = currentTime - item.date;
                    if (timeDifference > 60000) {
                        item.status = Statuses.ROTTEN;
                        isStatusChanged = true;
                        rottenCounter++;
                    } else if (timeDifference > 30000 && timeDifference < 60000 && item.status !== Statuses.YESTERDAY) {
                        item.status = Statuses.YESTERDAY;
                        isStatusChanged = true;
                    }
                });
                if (isStatusChanged) {
                    this.changeDetector.markForCheck();
                }
                if (this.stringListItems.length === rottenCounter) {
                    clearInterval(this.interval);
                    this.interval = 0;
                }
            }, 1000);
        }
    }
}
