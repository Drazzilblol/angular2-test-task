import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ColumnOptions} from './models/ColumnOptions';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'strings-grid-column',
    templateUrl: './stringGridColumn.template.html',
})
export class StringsGridColumn implements OnChanges {

    @Input() public options: ColumnOptions;
    public width: number = 0;

    public ngOnChanges(changes: SimpleChanges): void {
        this.width = this.options.width;

    }
}
