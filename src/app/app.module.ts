import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {ComponentsModule} from './components/components.module';

@NgModule({
    imports: [ComponentsModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
    }
}