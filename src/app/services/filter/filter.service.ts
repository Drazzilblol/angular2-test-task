import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import config from 'app/config.json';
import {filter, forEach, size, startsWith} from 'lodash';
import moment from 'moment';

const DATE_FORMAT: string = config.DATE.DATE_FORMAT;

@Injectable()
export class FilterService {

    constructor(private translate: TranslateService) {
    }

    public filterItems(items: any[], filterParams: any) {
        if (size(filterParams) === 0) {
            return items;
        }
        return this.filterFn(items, filterParams);
    }

    /**
     * Фильрует массив элементов SortParams согласно данным для фильтрации.
     * @param items Массив элементов.
     * @param filterParams Прараметры фильрации.
     * @return {IGridItem[]} Возвращает отфильтрованый список.
     */
    private filterFn(items: any[], filterParams: any): any[] {
        return filter(items, (item) => {
            let counter: number = 0;
            forEach(filterParams, (value, key) => {
                if (key === 'date') {
                    const interval = value.split(' - ');
                    const firstDate = moment(interval[0], DATE_FORMAT);
                    const secondDate = moment(interval[1], DATE_FORMAT);
                    const valueDate = moment(item[key], DATE_FORMAT);
                    if (value === '' || valueDate.isBetween(firstDate, secondDate)) {
                        counter++;
                    }
                } else if (this.isStringStartsWith(item[key], value)) {
                    counter++;
                }
            });
            return counter === size(filterParams);
        });
    }

    /**
     * Проверяет начинается ли строка с определенноый подстроки.
     * @param str Строка для проверки.
     * @param filterString Подстрока с котороый должна начинатся строка str.
     * @return {boolean} Возвращает результат проверки.
     */
    private isStringStartsWith(str: string, filterString: string) {
        if (!filterString) {
            return true;
        }
        const trans: string = this.translate.instant(str).toLowerCase();
        return startsWith(trans, filterString.toLowerCase());
    }

}
