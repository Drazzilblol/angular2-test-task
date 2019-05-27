import {NgModule} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {AppComponent} from './app.component';
import {LanguageDialog} from './components/language/dialog/languageDialogController';

import languages from "./components/language/languages.json"
import {ComponentsModule} from './components/components.module';

@NgModule({
    imports: [ComponentsModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    entryComponents: [LanguageDialog],
})
export class AppModule {
    constructor(translate: TranslateService) {
        translate.use(languages.defaultLanguage);
    }
}