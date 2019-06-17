import {Pipe, PipeTransform} from '@angular/core';
import {Statuses} from '../../enums/statuses.enum';
import {Colors} from '../../enums/colors.enum';

const colorsMap = {
    [Statuses.FRESH]: Colors.GREEN,
    [Statuses.YESTERDAY]: Colors.YELLOW,
    [Statuses.ROTTEN]: Colors.RED
};

@Pipe({name: 'colorsPipe'})
export class ColorsPipe implements PipeTransform {
    /**
     * Возвращает цвет статуса.
     * @param {string} input Название свойства CSS.
     * @param {Statuses} status текущий статус.
     * @return {string} Возвращает цвет компонета в зависимости от текщего статуса.
     */
    transform(input: string, status: Statuses): object {
        return {[input]: colorsMap[status]};
    };
}



