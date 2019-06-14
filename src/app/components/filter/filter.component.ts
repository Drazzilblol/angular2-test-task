import {ChangeDetectionStrategy, Component} from '@angular/core';
import {StringsFilterService} from '../../services/strings-filter/stringsFilter.service';
import {Statuses} from '../../enums/statuses.enum';
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
                width: '50px',
            })),

            transition('closed <=> open', [
                group([
                    animate("0.3s"),
                    query('@showHideElements', [
                        animateChild(),
                    ]),
                    query('@rotateIcon', [
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
        trigger('rotateIcon', [
            state('back', style({
                transform: 'rotate(180deg)'
            })),
            state('forward', style({
                transform: 'rotate(0)'
            })),
            transition('back <=> forward', [
                animate("0.3s")
            ]),
        ]),
    ]
})
export class FilterComponent {
    isOpen = false;
    NOT_SELECTED: string = "NOT_SELECTED";
    selected: string = this.NOT_SELECTED;
    statuses: string[] = this.getStatuses();

    constructor(private filterService: StringsFilterService) {
    }

    /**
     * Передает сервису параметры для фильтрации.
     * @param {string} text
     * @param {Statuses} status
     */
    filter(text: string, status: string): void {
        this.filterService.filter(new FilterParams(text ? text : null, status !== this.NOT_SELECTED ? Statuses[status] : null));
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
    }
}
