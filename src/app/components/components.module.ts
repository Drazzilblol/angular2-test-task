import {NgModule} from '@angular/core';
import {StringList} from './string-list/stringListController';
import {StringListContainer} from './string-list-container/stringListContainerController';
import {Language} from './language/languageController';
import {LanguageDialog} from './language/dialog/languageDialogController';
import {StringAdd} from './string-add/stringAddController';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {FiltersModule} from '../pipes/filters.module';
import languages from "./language/languages.json"

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/locales/locale-", ".json");
}

@NgModule({
    imports: [BrowserModule, NgbModule, FormsModule, HttpClientModule, FiltersModule, TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })],
    declarations: [ Language, LanguageDialog, StringListContainer, StringAdd, StringList],
    exports: [ Language, LanguageDialog, StringListContainer, StringAdd, StringList],
    entryComponents: [LanguageDialog]
})
export class ComponentsModule {
    constructor(translate: TranslateService) {
        translate.use(languages.defaultLanguage);
    }
}