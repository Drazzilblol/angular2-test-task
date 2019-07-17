import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {GridFilterCellComponent} from 'app/components/grid-filter-cell/gridFilterCell.component';
import {ResizableDirective} from 'app/directives/resizable/resizable.directive';
import {DraggableDirective} from '../directives/draggable/draggable.directive';
import {PipesModule} from '../pipes/pipes.module';
import {StringsHttpService} from '../services/getStrings/stringsHttp.service';
import {FilterService} from '../services/strings-filter/filter.service';
import {GridAddService} from '../services/strings/grid-add.service';
import {FilterComponent} from './filter/filter.component';
import {GridCellComponent} from './grid-cell/gridCell.component';
import {GridHeaderCellComponent} from './grid-header-cell/gridHeaderCell.component';
import {GridComponent} from './grid/grid.component';
import {LanguageDialogComponent} from './language/dialog/languageDialog.component';
import {LanguageComponent} from './language/language.component';
import {StringAddComponent} from './string-add/stringAdd.component';

@NgModule({
    declarations: [LanguageComponent, LanguageDialogComponent, StringAddComponent, GridComponent,
        FilterComponent, GridCellComponent, GridHeaderCellComponent, DraggableDirective, ResizableDirective,
        GridFilterCellComponent],
    entryComponents: [LanguageDialogComponent],
    exports: [LanguageComponent, StringAddComponent, GridComponent, FilterComponent],
    imports: [BrowserModule, NgbModule, ReactiveFormsModule, FormsModule, HttpClientModule, PipesModule,
        TranslateModule.forRoot({
            loader: {
                deps: [HttpClient],
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/locales/locale-', '.json'),
            },
        })],
    providers: [GridAddService, FilterService, StringsHttpService],
})
export class ComponentsModule {
}
