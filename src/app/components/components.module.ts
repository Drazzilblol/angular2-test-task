import {NgModule} from '@angular/core';
import {StringList} from './string-list/stringList.component';
import {Language} from './language/language.component';
import {LanguageDialog} from './language/dialog/languageDialog.component';
import {StringAdd} from './string-add/stringAdd.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {PipesModule} from '../pipes/pipes.module';
import {StatusComponent} from './status/status.component';
import {StringsService} from '../services/strings/strings.service';
import {FilterComponent} from './filter/filter.component';
import {StringsFilterService} from '../services/strings-filter/stringsFilter.service';

@NgModule({
    imports: [BrowserModule, NgbModule, FormsModule, HttpClientModule, PipesModule, TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (http: HttpClient) => new TranslateHttpLoader(http, "/locales/locale-", ".json"),
            deps: [HttpClient]
        }
    })],
    declarations: [ Language, LanguageDialog, StringAdd, StringList, StatusComponent, FilterComponent],
    exports: [ Language, LanguageDialog, StringAdd, StringList, StatusComponent, FilterComponent],
    entryComponents: [LanguageDialog],
    providers: [StringsService, StringsFilterService]
})
export class ComponentsModule {

}