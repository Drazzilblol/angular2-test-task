import {NgModule} from '@angular/core';
import {ColorsPipe} from './colors/colors.pipe';
import {StringFilterPipe} from "./stringFilter/stringFilter.pipe";

@NgModule({
    declarations: [ColorsPipe, StringFilterPipe],
    exports: [ColorsPipe, StringFilterPipe]
})
export class PipesModule {
    constructor() {
    }
}