import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DatePickerComponent} from 'app/components/date-interval-picker/datepicker/datePicker.component';
import {IntervalPickerComponent} from 'app/components/date-interval-picker/interval-picker/intervalPicker.component';
import {TimePickerComponent} from 'app/components/date-interval-picker/timepicker/timePicker.component';
import {GridDateFilterCellComponent} from 'app/components/grid/grid-date-filter-cell/gridDateFilterCell.component';
import {GridTextFilterCellComponent} from 'app/components/grid/grid-text-filter-cell/gridTextFilterCell.component';
import {ResizableDirective} from 'app/directives/resizable/resizable.directive';
import {DatePickerManagerService} from 'app/services/date-picker-manager/datePickerManager.service';
import {FilterService} from 'app/services/filter/filter.service';
import {DraggableDirective} from '../directives/draggable/draggable.directive';
import {PipesModule} from '../pipes/pipes.module';
import {FilterParamsService} from '../services/filter-params/filterParams.service';
import {StringsHttpService} from '../services/getStrings/stringsHttp.service';
import {GridAddService} from '../services/strings/grid-add.service';
import {FilterComponent} from './filter/filter.component';
import {GridCellComponent} from './grid/grid-cell/gridCell.component';
import {GridComponent} from './grid/grid-container/grid.component';
import {GridHeaderCellComponent} from './grid/grid-header-cell/gridHeaderCell.component';
import {LanguageDialogComponent} from './language/dialog/languageDialog.component';
import {LanguageComponent} from './language/language.component';
import {StringAddComponent} from './string-add/stringAdd.component';

@NgModule({
    declarations: [LanguageComponent, LanguageDialogComponent, StringAddComponent, GridComponent,
        FilterComponent, GridCellComponent, GridHeaderCellComponent, DraggableDirective, ResizableDirective,
        GridTextFilterCellComponent, DatePickerComponent, IntervalPickerComponent,
        TimePickerComponent, GridDateFilterCellComponent, GridTextFilterCellComponent],
    entryComponents: [LanguageDialogComponent, DatePickerComponent, IntervalPickerComponent, TimePickerComponent],
    exports: [LanguageComponent, StringAddComponent, GridComponent, FilterComponent],
    imports: [BrowserModule, NgbModule, ReactiveFormsModule, FormsModule, HttpClientModule, PipesModule,
        TranslateModule.forRoot({
            loader: {
                deps: [HttpClient],
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => new TranslateHttpLoader(http, '/locales/locale-', '.json'),
            },
        })],
    providers: [GridAddService, FilterParamsService, StringsHttpService, DatePickerManagerService, FilterService],
})
export class ComponentsModule {
}
