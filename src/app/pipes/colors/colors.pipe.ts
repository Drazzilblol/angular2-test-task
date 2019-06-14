import {Pipe, PipeTransform} from '@angular/core';
import {Statuses} from '../../enums/statuses.enum';
import {Colors} from '../../enums/colors.enum';

@Pipe({name: 'colorsPipe'})
export class ColorsPipe implements PipeTransform {
    /**
     * Возвращает цвет статуса.
     * @param {string} input Название свойства CSS.
     * @param {Statuses} status текущий статус.
     * @return {string} Возвращает цвет компонета в зависимости от текщего статуса.
     */
    transform(input: string, status: Statuses): object {
        let result: object = {};

        if (status === Statuses.FRESH) {
            result[input] = Colors.GREEN
        } else if (status === Statuses.YESTERDAY) {
            result[input] = Colors.YELLOW
        } else {
            result[input] = Colors.RED
        }

        return result;
    };
}



