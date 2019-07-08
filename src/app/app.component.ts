import {Component} from '@angular/core';
import {Columns} from './enums/columns.enum';
import {Column} from './services/column-manger-service/column';
import {ColumnManagerService} from './services/column-manger-service/columnManager.service';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
})
export class AppComponent {
    public columns: Column[];

    constructor(columnsManager: ColumnManagerService) {
        columnsManager.addColumn(new Column(Columns.STATUS, '', 'status', 24, {
            sortable: false,
            resizable: false,
        }));
        columnsManager.addColumn(new Column(Columns.TRANSFORMED, Columns.TRANSFORMED, 'transformedText',
            280, {
                sortable: true,
                resizable: true,
            }));
        columnsManager.addColumn(new Column(Columns.ORIGIN, Columns.ORIGIN, 'originText', 280,
            {
                sortable: true,
                resizable: true,
            }));
        columnsManager.addColumn(new Column(Columns.DATE, Columns.DATE, 'parsedDate', 216,
            {
                sortable: true,
                resizable: false,
                defaultSort: true,
            }));
        this.columns = columnsManager.getColumns();
    }
}
