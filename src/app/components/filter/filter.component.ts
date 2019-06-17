import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Statuses} from '../../enums/statuses.enum';
import {StringsFilterService} from '../../services/strings-filter/stringsFilter.service';
import {FilterParams} from './models/filterParams';

const NOT_SELECTED: string = 'NOT_SELECTED';
const statusesMap = {
    [NOT_SELECTED]: null,
    [Statuses.FRESH]: Statuses.FRESH,
    [Statuses.YESTERDAY]: Statuses.YESTERDAY,
    [Statuses.ROTTEN]: Statuses.ROTTEN,
};

@Component({
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
                    animate('0.3s'),
                    query('@showHideElements', [
                        animateChild(),
                    ]),
                    query('@rotateIcon', [
                        animateChild(),
                    ]),
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
                animate('0.3s', style({
                    opacity: 0,
                })),
            ]),
        ]),
        trigger('rotateIcon', [
            state('back', style({
                transform: 'rotate(180deg)',
            })),
            state('forward', style({
                transform: 'rotate(0)',
            })),
            transition('back <=> forward', [
                animate('0.3s'),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'filter',
    templateUrl: './filter.template.html',
})
export class FilterComponent {
    public isOpen = false;
    public statuses = Object.keys(statusesMap);
    public selected: string = NOT_SELECTED;
    public text: string;

    constructor(private filterService: StringsFilterService) {
    }

    /**
     * Передает сервису параметры для фильтрации.
     * @param {string} text
     * @param {Statuses} status
     */
    public filter(text: string, status: string): void {
        this.filterService.filter(new FilterParams(text ? text : null, statusesMap[status]));
    }

    /**
     * Сворачивает или разворачивает SideNav.
     */
    public toggle(): void {
        this.isOpen = !this.isOpen;
    }
}
