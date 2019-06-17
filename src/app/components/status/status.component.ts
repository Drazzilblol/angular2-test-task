import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Statuses} from '../../enums/statuses.enum';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'status',
    templateUrl: './status.template.html',
})
export class StatusComponent {
    @Input() public status: Statuses;
}
