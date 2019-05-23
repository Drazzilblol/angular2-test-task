import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppComponent} from './app.component';
import {Language} from './components/language/languageController';
import {NgbdModalContent} from './components/language/dialog/languageDialogController';
import {StringListContainer} from './components/string-list-container/stringListContainerController';
import {StringAdd} from './components/string-add/stringAddController';
import {StringList} from './components/string-list/stringListController';
import {NumbersFilter} from './pipes/numbersFilter';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "/locales/locale-", ".json");
}

@NgModule({
    imports: [BrowserModule, NgbModule, FormsModule, HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })],
    declarations: [AppComponent, Language, NgbdModalContent, StringListContainer, StringAdd, StringList, NumbersFilter],
    bootstrap: [AppComponent],
    entryComponents: [NgbdModalContent],
})
export class AppModule {
    constructor(translate: TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
    }
}