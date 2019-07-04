import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Statuses} from 'app/enums/statuses.enum';
import {StringsHttpService} from 'app/services/getStrings/stringsHttp.service';
import {StringsFilterService} from 'app/services/strings-filter/stringsFilter.service';
import {StringsService} from 'app/services/strings/strings.service';
import {forEach, now} from 'lodash';
import {interval, Subscription} from 'rxjs';
import {Column} from '../../services/column-manger-service/column';
import {ColumnManagerService} from '../../services/column-manger-service/columnManager.service';
import {FilterParams} from '../filter/models/filterParams';
import {SortParams} from '../string-grid-header/models/SortParams';
import {StringListItem} from './models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'strings-grid',
    templateUrl: './stringGridContainer.template.html',
})
export class StringList implements OnDestroy {
    public filterParams: FilterParams = new FilterParams('', null);
    public subscription: Subscription;
    public stringListItems: StringListItem[] = [];
    public intervalSub: Subscription;
    public columns: Column[];

    constructor(private stringService: StringsService, private changeDetector: ChangeDetectorRef,
                private filterService: StringsFilterService, private getStringsService: StringsHttpService,
                private columnManager: ColumnManagerService) {

        this.columns = columnManager.getColumns();

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

    /**
     * Сортирует элементы в порядке указаном в params.
     * @param params
     */
    public sort(params: SortParams): void {
        this.stringListItems.sort((a, b) => {
            return a[params.column].localeCompare(b[params.column],
                undefined,
                {numeric: true, sensitivity: 'base'});
        });
        if (params.order === Order.DESC) {
            this.stringListItems = this.stringListItems.reverse();
        }
        this.changeDetector.markForCheck();
    }
}
