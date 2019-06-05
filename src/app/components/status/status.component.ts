import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'status',
    templateUrl: './status.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent {
    @Input() status: string;

    constructor() {
    }

    /**
     * В зависимости от текущего статуса возвращает цвет.
     */
    getColor(): string {
        if (this.status === 'FRESH') {
            return 'green'
        }  if (this.status === 'YESTERDAY') {
            return 'yellow'
        }  if (this.status === 'ROTTEN') {
            return 'red'
        }
    }
}


