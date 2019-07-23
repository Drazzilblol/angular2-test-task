import {NgModule} from '@angular/core';
import {ColorsPipe} from './colors/colors.pipe';

@NgModule({
    declarations: [ColorsPipe],
    exports: [ColorsPipe],
})
export class PipesModule {
}
