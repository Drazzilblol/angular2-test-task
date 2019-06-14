import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Statuses} from '../../enums/statuses.enum';


@Component({
    selector: 'status',
    templateUrl: './status.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent {
    @Input() status: Statuses;

    constructor() {
    }

}


