import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Column} from 'app/services/column-manger-service/column';
import {StringListItem} from '../string-grid-container/models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'grid-row',
    templateUrl: './gridRow.template.html',
})
export class GridRowComponent {
    @Input() public item: any;
    @Input() public columns: Column[];
}
