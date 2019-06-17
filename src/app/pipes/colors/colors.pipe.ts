import {Pipe, PipeTransform} from '@angular/core';
import {Statuses} from 'app/enums/statuses.enum';

const colorsMap = {
    [Statuses.FRESH]: 'status-green',
    [Statuses.YESTERDAY]: 'status-yellow',
    [Statuses.ROTTEN]: 'status-red',
};

@Pipe({name: 'colorsPipe'})
export class ColorsPipe implements PipeTransform {
    /**
     * Возвращает цвет статуса.
     * @param {Statuses} status текущий статус.
     * @return {string} Возвращает цвет компонета в зависимости от текщего статуса.
     */
    public transform(status: Statuses): object {
        return {[colorsMap[status]]: true};
    }
}
