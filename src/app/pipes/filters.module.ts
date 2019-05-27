import {NgModule} from '@angular/core';
import {NumbersFilter} from './numbersFilter';

@NgModule({
    declarations: [NumbersFilter],
    exports: [NumbersFilter]
})
export class FiltersModule {
    constructor() {
    }
}