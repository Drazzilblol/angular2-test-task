import {Pipe, PipeTransform} from '@angular/core';
import isEmpty from 'lodash/isEmpty'

@Pipe({name: 'numbersPipe'})
export class NumbersPipe implements PipeTransform {
    /**
     * Извлекает из строки цифры.
     * @param {string} input Исходная строка.
     * @return {string} Если строка не содержит цифры возвращает сообщение,
     * если содержит то возвращает строку состоящую из цифр
     */
    transform(input: string): string {
        if (isEmpty(input)) return 'MESSAGE';

        let filteredArray = input.split('')
            .filter(element => !isNaN(+element));

        return filteredArray.length ? filteredArray.join('') : 'MESSAGE';
    };
}



