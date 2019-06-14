import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StringsService} from '../../services/strings/strings.service';
import {StringListItem} from '../string-list/models/StringListItem';
import {now} from 'lodash'
import {Statuses} from '../../enums/statuses.enum';

@Component({
    selector: 'string-add',
    templateUrl: './stringAdd.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringAdd {
    constructor(private stringService: StringsService) {
    }

    /**
     * Передает строку сервису StringsFilterService для добавления в список.
     * @param {string} text Строка которая должна быть добавлена в список.
     */
    addItem(text: string): void {
        this.stringService.addString(new StringListItem(text, now(), Statuses.FRESH))
    }
}
