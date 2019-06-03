import {NgModule} from '@angular/core';
import {NumbersPipe} from './numbers.pipe';

@NgModule({
    declarations: [NumbersPipe],
    exports: [NumbersPipe]
})
export class PipesModule {
    constructor() {
    }
}