import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StringsFilterService} from '../../services/strings-filter/stringsFilter.service';
import {Statuses} from '../status/statuses';
import {animate, animateChild, group, query, state, style, transition, trigger} from "@angular/animations";
import {FilterParams} from "./models/filterParams";

@Component({
    selector: 'filter',
    templateUrl: './filter.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('openClose', [
            state('open', style({
                width: '400px',
            })),
            state('closed', style({
                width: '90px',
            })),

            transition('closed <=> open', [
                group([
                    animate("0.3s"),
                    query('@showHideElements', [
                        animateChild(),
                    ])
                ]),
            ]),
        ]),
        trigger('showHideElements', [
            state('show', style({
                opacity: 1,
            })),
            state('hide', style({
                opacity: 0,
            })),
            transition('show <=> hide', [
                style({
                    opacity: 0,
                }),
                animate("0.3s", style({
                    opacity: 0,
                }))
            ]),
        ]),
    ]
})
export class FilterComponent {
    isOpen = false;
    navButtonText: string = this.isOpen ? '=>' : '<=';
    NOT_SELECTED: string = "NOT_SELECTED";
    selected: string = this.NOT_SELECTED;
    statuses: string[] = this.getStatuses();

    constructor(private filterService: StringsFilterService) {
    }

    /**
     * Передает строку сервису StringsFilterService для добавления в список.
     * @param {string} text Строка которая должна быть добавлена в список.
     * @param status
     */
    /*TODO: подумать*/
    filter(text: string, status: string): void {
        this.filterService.filter(new FilterParams(text ? text : null, status !== this.NOT_SELECTED ? status : null));
    }

    /**
     * Получает массив статусов из перечисления.
     * @return {string[]} озвращает массив статусов
     */
    getStatuses(): string[] {
        let statuses: string[] = Object.keys(Statuses);
        statuses.unshift(this.NOT_SELECTED);
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
