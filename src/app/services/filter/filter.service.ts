import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IGridItem} from 'app/components/string-add/models/IGridItem';
import {filter, forEach, size, startsWith} from 'lodash';
import moment from 'moment';

const DATE_FORMAT: string = 'DD-MM-YYYY HH:mm:ss';

@Injectable()
export class FilterService {

    constructor(private translate: TranslateService) {
    }

    public filterItems(items, filterParams) {
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
    private filterFn(items: IGridItem[], filterParams: any): IGridItem[] {
        return filter(items, (item) => {
            let counter: number = 0;
            forEach(filterParams, (value, key) => {
                if (key === 'parsedDate') {
                    const interval = value.split(' - ');
                    const firstDate = moment(interval[0], DATE_FORMAT);
                    const secondDate = moment(interval[1], DATE_FORMAT).endOf('day');
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
