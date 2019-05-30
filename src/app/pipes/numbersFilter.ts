"use strict";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numbersFilter' })
export class NumbersFilter implements PipeTransform{

    transform(input: string){
            if (input === "") return "MESSAGE";

            let filteredArray = input.split("")
                .filter(element => !isNaN(+element));

            return filteredArray.length ? filteredArray.join("") : "MESSAGE";
        };
}



