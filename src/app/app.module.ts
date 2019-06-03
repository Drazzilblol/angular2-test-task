import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ComponentsModule} from './components/components.module';
import {TranslateService} from '@ngx-translate/core';
import languages from "./components/language/languages.json"
@NgModule({
    imports: [ComponentsModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(translate: TranslateService) {
        translate.addLangs(languages.languagesList)
        translate.use(languages.defaultLanguage);
    }
}