import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Statuses} from 'app/enums/statuses.enum';
import {StringsFilterService} from 'app/services/strings-filter/stringsFilter.service';
import {FilterParams} from './models/filterParams';

const NOT_SELECTED: string = 'NOT_SELECTED';
const statusesMap = {
    [NOT_SELECTED]: null,
    [Statuses.FRESH]: Statuses.FRESH,
    [Statuses.YESTERDAY]: Statuses.YESTERDAY,
    [Statuses.ROTTEN]: Statuses.ROTTEN,
};

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'filter',
    templateUrl: './filter.template.html',
})
export class FilterComponent {
    public isOpen = false;
    public statuses = Object.keys(statusesMap);
    public selected: string = NOT_SELECTED;
    public text: string;

    constructor(private filterService: StringsFilterService) {
    }

    /**
     * Передает сервису параметры для фильтрации.
     * @param {string} text
     * @param {Statuses} status
     */
    public filter(text: string, status: string): void {
        this.filterService.filter(new FilterParams(text ? text : null, statusesMap[status]));
    }

    /**
     * Сбрасывает параметры фильтрации.
     */
    public resetFilter(): void {
        this.selected = NOT_SELECTED;
        this.text = '';
        this.filterService.filter(new FilterParams(null, null));
    }

    /**
     * Сворачивает или разворачивает SideNav.
     */
    public toggle(): void {
        this.isOpen = !this.isOpen;
    }
}
