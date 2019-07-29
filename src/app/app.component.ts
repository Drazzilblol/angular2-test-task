import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {clone, concat, forEach, now} from 'lodash';
import {interval, Subscription} from 'rxjs';
import * as config from './config.json';
import {Columns} from './enums/columns.enum';
import {Statuses} from './enums/statuses.enum';
import {Column} from './services/column-manger-service/column';
import {FilterParamsService} from './services/filter-params/filterParams.service';
import {StringsHttpService} from './services/getStrings/stringsHttp.service';
import {GridAddService} from './services/strings/grid-add.service';

const MIN_WIDTH: number = config.COLUMN.MIN_WIDTH;

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit {
    public items: any[] = [];
    public columns1: Column[];
    public columns2: Column[];
    public subscription: Subscription;
    public intervalSub: Subscription;
    public filterParams1: any = {};
    public filterParams2: any = {};

    constructor(private gridAddService: GridAddService, private changeDetector: ChangeDetectorRef,
                private filterService: FilterParamsService, private stringsHttpService: StringsHttpService) {
    }

    public ngOnInit(): void {
        this.initColumns();
        this.initSubscriptions();
    }

    private initColumns() {
        this.columns1 = [
            new Column(Columns.STATUS, ColumnsTypes.STATUS, 'status', 23),
            new Column(Columns.TRANSFORMED, ColumnsTypes.TEXT, 'transformedText', 280,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    filterable: true,
                    minWidth: MIN_WIDTH,
                }),
            new Column(Columns.ORIGIN, ColumnsTypes.TEXT, 'originText', 280,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    filterable: true,
                    minWidth: MIN_WIDTH,
                }),
            new Column(Columns.DATE, ColumnsTypes.DATE, 'parsedDate', 216,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    defaultSort: true,
                    filterable: true,
                    minWidth: MIN_WIDTH,
                }),
        ];

        this.columns2 = [
            new Column(Columns.STATUS, ColumnsTypes.STATUS, 'status', 23),
            new Column(Columns.TRANSFORMED, ColumnsTypes.TEXT, 'transformedText', 280,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    filterable: true,
                    minWidth: MIN_WIDTH,
                }),
            new Column(Columns.ORIGIN, ColumnsTypes.TEXT, 'originText', 280,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    filterable: true,
                    minWidth: MIN_WIDTH,
                }),
            new Column(Columns.DATE, ColumnsTypes.DATE, 'parsedDate', 216,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    defaultSort: true,
                    filterable: true,
                    minWidth: MIN_WIDTH,
                }),
        ];
    }

    private initSubscriptions() {
        this.subscription = this.gridAddService.getObservable().subscribe((item: any) => {
            this.items = concat(this.items, item);
            this.countdown();
        });

        this.subscription.add(this.stringsHttpService.getStrings().subscribe((items: any[]) => {
            this.items = concat(this.items, items);
            this.countdown();
        }));

        this.subscription.add(this.filterService.getObservable().subscribe((filterParams: any) => {
            this.filterParams1 = clone(filterParams);
            this.filterParams2 = clone(filterParams);
        }));
    }

    /**
     * Раз в секунду сравнивает текущее время и время добавления всех элементов списка,
     * если прошло достаточно времени изменяет статус элемента, после того как все элементы
     * получили статус ROTTEN, интервал останавливается.
     * @return {number} Возвращает номер интервала.
     */
    public countdown(): void {
        if ((!this.intervalSub || this.intervalSub.closed) && this.isFiltered()) {
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
                    this.items = clone(this.items);
                    this.changeDetector.markForCheck();
                }
                if (this.items.length === rottenCounter) {
                    this.intervalSub.unsubscribe();
                }
            });
        }
    }

    private isFiltered() {
        return !this.filterParams1.filter && !this.filterParams1.status
            && !this.filterParams2.filter && !this.filterParams2.status;
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        if (this.intervalSub) {
            this.intervalSub.unsubscribe();
        }
    }
}
