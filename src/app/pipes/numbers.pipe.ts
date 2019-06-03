import {Pipe, PipeTransform} from '@angular/core';
import isEmpty from 'lodash/isEmpty'

@Pipe({name: 'numbersPipe'})
export class NumbersPipe implements PipeTransform {

    transform(input: string) {
        if (isEmpty(input)) return 'MESSAGE';

        let filteredArray = input.split('')
            .filter(element => !isNaN(+element));

        return filteredArray.length ? filteredArray.join('') : 'MESSAGE';
    };
}



