import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {Order} from 'app/enums/order.enum';
import {Statuses} from 'app/enums/statuses.enum';
import {Column} from 'app/services/column-manger-service/column';
import {StringsHttpService} from 'app/services/getStrings/stringsHttp.service';
import {FilterService} from 'app/services/strings-filter/filter.service';
import {GridAddService} from 'app/services/strings/grid-add.service';
import {forEach, now} from 'lodash';
import {interval, Subscription} from 'rxjs';
import {FilterParams} from '../filter/models/filterParams';
import {SortParams} from '../string-grid-header/models/SortParams';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid',
    templateUrl: './grid.template.html',
})
export class GridComponent implements OnDestroy {
    public filterParams: FilterParams = new FilterParams('', null);
    public subscription: Subscription;
    public items: any[] = [];
    public intervalSub: Subscription;
    @Input() public columns: Column[] = [];

    constructor(private gridAddService: GridAddService, private changeDetector: ChangeDetectorRef,
                private filterService: FilterService, private stringsHttpService: StringsHttpService) {

        this.subscription = gridAddService.getObservable().subscribe((item: any) => {
            this.items.push(item);
            changeDetector.markForCheck();
            this.countdown();
        });

        this.subscription.add(stringsHttpService.getStrings().subscribe((items: any[]) => {
            forEach(items, (item) => {
                this.items.push(item);
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
                forEach(this.items, (item) => {
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
                if (this.items.length === rottenCounter) {
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
        this.items.sort((a, b) => {
            return a[params.column].localeCompare(b[params.column],
                undefined,
                {numeric: true, sensitivity: 'base'});
        });
        if (params.order === Order.DESC) {
            this.items = this.items.reverse();
        }
        this.changeDetector.markForCheck();
    }

}
