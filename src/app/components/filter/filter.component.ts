import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StringsService} from '../../services/strings/strings.service';
import {StringListItem} from '../string-list/models/StringListItem';
import {StringsFilterService} from '../../services/strings-filter/stringsFilter.service';
import {StringsFilterRequest} from '../../services/strings-filter/stringsFilterRequest';
import {Statuses} from '../status/statuses';

@Component({
    selector: 'filter',
    templateUrl: './filter.template.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class FilterComponent {

    constructor(private filterService: StringsFilterService) {
    }

    /**
     * Передает строку сервису StringsFilterService для добавления в список.
     * @param {string} text Строка которая должна быть добавлена в список.
     * @param selected
     */
    filter(text: string): void {
        this.filterService.filter({text: text})
    }
}
