import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StringsFilterService} from '../../services/strings-filter/stringsFilter.service';
import {Statuses} from '../status/statuses';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'filter',
    templateUrl: './filter.template.html',
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [
        trigger('openClose', [
            state('open', style({
                width: '400px',
            })),
            state('closed', style({
                width: '90px',
            })),

            transition('closed <=> open', [
                animate('0.5s')
            ]),
        ]),
        trigger('showHideElements', [
            state('show', style({})),
            state('hide', style({
                display: 'none',
            })),
        ]),
    ],
})
export class FilterComponent {
    selected: string = "NOT_SELECTED";
    isOpen = false;
    navButtonText: string = this.isOpen ? '=>' : '<=';

    constructor(private filterService: StringsFilterService) {
    }

    /**
     * Передает строку сервису StringsFilterService для добавления в список.
     * @param {string} text Строка которая должна быть добавлена в список.
     * @param status
     */
    filter(text: string, status: string): void {
        this.filterService.filter({text: text, status: status !== "NOT_SELECTED" ? status : null})
    }

    /**
     * Получает массив статусов из перечисления.
     * @return {string[]} озвращает массив статусов
     */
    getStatuses(): string[] {
        let statuses: string[] = Object.keys(Statuses);
        statuses.unshift("NOT_SELECTED");
        return statuses
    }

    /**
     * Сворачивает или разворачивает SideNav.
     */
    toggle(): void {
        this.isOpen = !this.isOpen;
        this.navButtonText = this.isOpen ? '=>' : '<='
    }
}
