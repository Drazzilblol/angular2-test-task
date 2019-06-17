import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {PipesModule} from '../pipes/pipes.module';
import {StringsHttpService} from '../services/getStrings/stringsHttp.service';
import {StringsFilterService} from '../services/strings-filter/stringsFilter.service';
import {StringsService} from '../services/strings/strings.service';
import {FilterComponent} from './filter/filter.component';
import {LanguageDialog} from './language/dialog/languageDialog.component';
import {Language} from './language/language.component';
import {StatusComponent} from './status/status.component';
import {StringAdd} from './string-add/stringAdd.component';
import {StringList} from './string-list/stringList.component';

@NgModule({
    declarations: [Language, LanguageDialog, StringAdd, StringList, StatusComponent, FilterComponent],
    entryComponents: [LanguageDialog],
    exports: [Language, LanguageDialog, StringAdd, StringList, StatusComponent, FilterComponent],
    imports: [BrowserModule, NgbModule, FormsModule, HttpClientModule, PipesModule,
        TranslateModule.forRoot({
            loader: {
                deps: [HttpClient],
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/locales/locale-', '.json'),
            },
        })],
    providers: [StringsService, StringsFilterService, StringsHttpService],
})
export class ComponentsModule {
}
