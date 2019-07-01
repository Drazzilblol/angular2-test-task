import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Columns} from 'app/enums/columns.enum';
import {StringListItem} from '../string-grid-container/models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'strings-grid-row',
    templateUrl: './stringGridRow.template.html',
})
export class StringsGridRow {
    @Input() public item: StringListItem;

    public columns = Columns;
}
