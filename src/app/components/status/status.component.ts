import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Statuses} from './statuses';

@Component({
    selector: 'status',
    templateUrl: './status.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent implements OnChanges{
    @Input() status: Statuses;

    color: string;

    constructor() {
    }

    /**
     * В зависимости от текущего статуса возвращает цвет.
     */
    setColor(): void {
        if (this.status === Statuses.FRESH) {
            this.color = 'green'
        }  if (this.status === Statuses.YESTERDAY) {
            this.color = 'yellow'
        }  if (this.status === Statuses.ROTTEN) {
            this.color = 'red'
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setColor()
    }
}


