import {NgModule} from '@angular/core';
import {NumbersPipe} from './numbers/numbers.pipe';
import {ColorsPipe} from './colors/colors.pipe';
import {StringFilterPipe} from "./stringFilter/stringFilter.pipe";

@NgModule({
    declarations: [NumbersPipe, ColorsPipe, StringFilterPipe],
    exports: [NumbersPipe, ColorsPipe, StringFilterPipe]
})
export class PipesModule {
    constructor() {
    }
}