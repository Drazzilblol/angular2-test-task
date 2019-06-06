import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Statuses} from './statuses';

@Component({
    selector: 'status',
    templateUrl: './status.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent {
    @Input() status: Statuses;

    constructor() {
    }

    /**
     * В зависимости от текущего статуса возвращает цвет.
     */
    getColor(): string {
        if (this.status === Statuses.FRESH) {
            return 'green'
        }  if (this.status === Statuses.YESTERDAY) {
            return 'yellow'
        }  if (this.status === Statuses.ROTTEN) {
            return 'red'
        }
    }
}


