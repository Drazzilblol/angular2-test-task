import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {clone, concat, forEach, now} from 'lodash';
import {interval, Subscription} from 'rxjs';
import {Columns} from './enums/columns.enum';
import {Statuses} from './enums/statuses.enum';
import {Column} from './services/column-manger-service/column';
import {ColumnManagerService} from './services/column-manger-service/columnManager.service';
import {FilterService} from './services/filter/filter.service';
import {StringsHttpService} from './services/getStrings/stringsHttp.service';
import {GridAddService} from './services/strings/grid-add.service';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit {
    public items: any[] = [];
    public columns: Column[];
    public subscription: Subscription;
    public intervalSub: Subscription;
    public filterParams: any = {};

    constructor(public columnsManager: ColumnManagerService, private gridAddService: GridAddService,
                private changeDetector: ChangeDetectorRef, private filterService: FilterService,
                private stringsHttpService: StringsHttpService) {
    }

    public ngOnInit(): void {
        this.initColumns();
        this.initSubscriptions();
    }

    private initColumns() {
        const columnsArray: Column[] = [
            new Column('', 'status', 23),
            new Column(Columns.TRANSFORMED, 'transformedText', 280,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    filterable: true,
                }),
            new Column(Columns.ORIGIN, 'originText', 280,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    filterable: true,
                }),
            new Column(Columns.DATE, 'parsedDate', 216,
                {
                    sortable: true,
                    resizable: true,
                    draggable: true,
                    defaultSort: true,
                    filterable: true,
                }),
        ];

        this.columns = this.columnsManager.addColumns(columnsArray);
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
            this.filterParams = filterParams;
        }));
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
                    this.items = clone(this.items);
                    this.changeDetector.markForCheck();
                }
                if (this.items.length === rottenCounter) {
                    this.intervalSub.unsubscribe();
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        if (this.intervalSub) {
            this.intervalSub.unsubscribe();
        }
    }
}
