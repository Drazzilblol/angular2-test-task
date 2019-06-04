import {Component} from '@angular/core';

@Component({
    selector: 'status',
    templateUrl: './status.template.html',
})
export class StatusComponent {
    status: string = 'FRESH';

    constructor() {
        this.statusCountdown()
    }

    /**
     * Изменяет статус компонента каждые 30 секунд.
     */
    statusCountdown(): void {
        setTimeout(() => {
                if (this.status == 'FRESH') {
                    this.status = 'YESTERDAY';
                    this.statusCountdown();
                } else if (this.status == 'YESTERDAY') {
                    this.status = 'ROTTEN';
                }
            },
            30000)
    }

    /**
     * В зависимости от текущего статуса возвращает цвет.
     */
    getColor(): string {
        if (this.status == 'FRESH') {
            return 'green'
        } else if (this.status == 'YESTERDAY') {
            return 'yellow'
        } else if (this.status == 'ROTTEN') {
            return 'red'
        }
    }
};


