import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StringsService} from '../../services/strings.service';

@Component({
    selector: 'string-add',
    templateUrl: './stringAdd.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringAdd {
    constructor(private stringService: StringsService) {
    }

    /**
     * Передает строку сервису StringsService для добавления в список.
     * @param {string} text Строка которая должна быть добавлена в список.
     */
    addItem(text: string): void {
        this.stringService.addString(text)
    }
};
