import {NgModule} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppComponent} from './app.component';
import {ComponentsModule} from './components/components.module';
import languages from './components/language/languages.json';
import {ColumnManagerService} from './services/column-manger-service/columnManager.service';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [ComponentsModule],
    providers: [ColumnManagerService],
})
export class AppModule {
    constructor(translate: TranslateService) {
        translate.addLangs(languages.languagesList);
        translate.use(languages.defaultLanguage);
    }
}
