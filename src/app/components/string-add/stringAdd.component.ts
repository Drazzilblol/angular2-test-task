import {ChangeDetectionStrategy, Component} from '@angular/core';
import {now} from 'lodash';
import {Statuses} from '../../enums/statuses.enum';
import {StringsService} from '../../services/strings/strings.service';
import {StringListItem} from '../string-list/models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'string-add',
    templateUrl: './stringAdd.template.html',
})
export class StringAdd {
    public text: string;

    constructor(private stringService: StringsService) {
    }

    /**
     * Передает строку сервису StringsFilterService для добавления в список.
     * @param {string} text Строка которая должна быть добавлена в список.
     */
    public addItem(text: string): void {
        this.stringService.addString(new StringListItem(text, now(), Statuses.FRESH));
    }
}
