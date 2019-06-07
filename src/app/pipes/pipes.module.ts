import {NgModule} from '@angular/core';
import {NumbersPipe} from './numbers/numbers.pipe';
import {ColorsPipe} from './colors/colors.pipe';

@NgModule({
    declarations: [NumbersPipe, ColorsPipe],
    exports: [NumbersPipe, ColorsPipe]
})
export class PipesModule {
    constructor() {
    }
}