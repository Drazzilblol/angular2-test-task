import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Statuses} from 'app/enums/statuses.enum';
import {StringsHttpService} from 'app/services/getStrings/stringsHttp.service';
import {StringsFilterService} from 'app/services/strings-filter/stringsFilter.service';
import {StringsService} from 'app/services/strings/strings.service';
import {forEach, now, remove} from 'lodash';
import {interval, Subscription} from 'rxjs';
import {FilterParams} from '../filter/models/filterParams';
import {StringListItem} from './models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'strings-list',
    templateUrl: './stringList.template.html',
})
export class StringList implements OnDestroy {
    public filterParams: FilterParams = new FilterParams('', null);
    public subscription: Subscription;
    public stringListItems: StringListItem[] = [];
    public intervalSub: Subscription;

    constructor(private stringService: StringsService, private changeDetector: ChangeDetectorRef,
                private filterService: StringsFilterService, private getStringsService: StringsHttpService) {

        this.subscription = stringService.getObservable().subscribe((stringListItem: StringListItem) => {
            this.stringListItems.push(stringListItem);
            changeDetector.markForCheck();
            this.countdown();
        });

        this.subscription.add(getStringsService.getStrings().subscribe((res: any[]) => {
            forEach(res, (item) => {
                this.stringListItems.push(new StringListItem(item.text, new Date(item.date), item.status));
            });
            changeDetector.markForCheck();
            this.countdown();
        }));

        this.subscription.add(filterService.getObservable().subscribe((filterParams: FilterParams) => {
            this.filterParams = filterParams;
            if (filterParams.text || filterParams.status) {
                this.intervalSub.unsubscribe();
            } else {
                this.countdown();
            }
            changeDetector.markForCheck();
        }));
    }

    /**
     * Удаляет строку из списка
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
                item.date = new Date(now());
                item.status = Statuses.FRESH;
            }
        });
        this.countdown();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        if (this.intervalSub) {
            this.intervalSub.unsubscribe();
        }
    }

    /**
     * Раз в секунду сравнивает текущее время и время добавления всех элементов списка,
     * если прошло достаточно времени изменяет статус элемента, после того как все элементы
     * получили статус ROTTEN, интервал останавливается.
     * @return {number} Возвращает номер интервала.
     */
    public countdown(): void {
        if ((!this.intervalSub || this.intervalSub.closed) && !this.filterParams.text && !this.filterParams.status) {
            this.intervalSub = interval(1000).subscribe(() => {
                const currentTime: number = now();
                let rottenCounter: number = 0;
                let isStatusChanged: boolean = false;
                forEach(this.stringListItems, (item) => {
                    if (item.status === Statuses.ROTTEN) {
                        rottenCounter++;
                        return;
                    }
                    const timeDifference = currentTime - item.date.getTime();
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
                    this.intervalSub.unsubscribe();
                }
            });
        }
    }
}
