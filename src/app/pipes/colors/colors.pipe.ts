import {Pipe, PipeTransform} from '@angular/core';
import isEmpty from 'lodash/isEmpty'
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
        if (isEmpty(input)) {
            result[input] = Colors.GREEN;
            return result;
        }
        if (status === Statuses.FRESH) {
            result[input] = Colors.GREEN
        }
        if (status === Statuses.YESTERDAY) {
            result[input] = Colors.YELLOW
        }
        if (status === Statuses.ROTTEN) {
            result[input] = Colors.RED
        }

        return result;
    };
}



