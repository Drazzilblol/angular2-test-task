import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {StringListItem} from '../string-grid-container/models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'strings-grid-row',
    templateUrl: './stringGridRow.template.html',
})
export class StringsGridRow {
    @Input() public item: StringListItem;
    public columns: Column[];

    constructor(columnManagerService: ColumnManagerService) {
        this.columns = columnManagerService.getColumns();
    }
}
