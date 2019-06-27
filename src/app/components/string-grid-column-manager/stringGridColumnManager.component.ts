import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {forEach, size} from 'lodash';
import {Columns} from '../../enums/columns.enum';
import {GridOptionsTransmitterService} from '../../services/grid-options-transmitter/gridOptionsTransmitter.service';
import {ColumnOptions} from '../string-grid-column/models/ColumnOptions';
import {StringListItem} from '../string-grid-container/models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'strings-grid-column-manager',
    templateUrl: './stringGridColumnManager.template.html',
})
export class StringsGridColumnManager {

    @Input() public items: StringListItem[];

    @Input() public columnsOptions = {
        [Columns.DATE]: new ColumnOptions(Columns.DATE, 216),
        [Columns.ORIGIN]: new ColumnOptions(Columns.ORIGIN, 280),
        [Columns.TRANSFORMED]: new ColumnOptions(Columns.TRANSFORMED, 280),
    };

    public columns = Columns;

    constructor(private transmitter: GridOptionsTransmitterService) {
        transmitter.getObservable().subscribe((res) => {
            this.recalculateColumns(this.columnsOptions[res.title], res);
            this.columnsOptions[res.title] = new ColumnOptions(res.title, res.width);
        });
    }

    public recalculateColumns(oldOpt, newOpt): void {
        const diff: number = oldOpt.width - newOpt.width;
        forEach(this.columnsOptions, (value, key) => {
            if (key !== newOpt.title) {
                this.columnsOptions[key] = new ColumnOptions(key, value.width + diff / (size(this.columnsOptions) - 1));
            }
        });
    }
}
