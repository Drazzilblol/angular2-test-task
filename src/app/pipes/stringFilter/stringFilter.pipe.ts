import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StringGridItem} from 'app/components/string-add/models/StringGridItem';
import {filter, forEach, size, startsWith} from 'lodash';

@Pipe({
    name: 'stringFilter',
    pure: false,
})
export class StringFilterPipe implements PipeTransform {
    constructor(private translate: TranslateService) {
    }

    public transform(items: StringGridItem[], filterParams: any) {
        if (size(filterParams) === 0) {
            return items;
        }
        return this.filterFn(items, filterParams);
    }

    /**
     * Фильрует массив элементов SortParams согласно данным для фильтрации.
     * @param items Массив элементов.
     * @param filterParams Прараметры фильрации.
     * @return {StringGridItem[]} Возвращает отфильтрованый список.
     */
    private filterFn(items: any[], filterParams: any): StringGridItem[] {
        return filter(items, (item) => {
            let counter: number = 0;
            forEach(filterParams, (value, key) => {
                if (this.isStringStartsWith(item[key], value)) {
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
