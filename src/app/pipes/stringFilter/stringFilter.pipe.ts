import {Pipe, PipeTransform} from '@angular/core';
import {filter, startsWith} from 'lodash'
import {FilterParams} from '../../components/filter/models/filterParams';
import {StringListItem} from '../../components/string-list/models/StringListItem';
import {TranslateService} from '@ngx-translate/core';
import {Statuses} from '../../enums/statuses.enum';

@Pipe({
    name: 'stringFilter',
    pure: false
})
export class StringFilterPipe implements PipeTransform {

    constructor(private translate: TranslateService) {
    }


    public transform(items: StringListItem[], filterParams: FilterParams) {
        if (!filterParams.text && !filterParams.status) {
            return items;
        }

        return this.filterFn(items, filterParams);
    }

    /**
     * Фильрует массив элементов StringListItem согласно данным для фильтрации.
     * @param items Массив элементов.
     * @param filterParams Прараметры фильрации.
     * @return {StringListItem[]} Возвращает отфильтрованый список.
     */
    private filterFn(items: StringListItem[], filterParams: FilterParams): StringListItem[] {
        return filter(items, item => {
            return this.isStringStartsWith(item.transformedText, filterParams.text)
                && StringFilterPipe.isStatusEqualsFilterStatus(item.status, filterParams.status);
        })
    }

    /**
     * Проверяет начинается ли строка с определенноый подстроки.
     * @param str Строка для проверки.
     * @param filterString Подстрока с котороый должна начинатся строка str.
     * @return {boolean} Возвращает результат проверки.
     */
    private isStringStartsWith(str: string, filterString: string) {
        if (!filterString) return true;

        let trans: string = this.translate.instant(str).toLowerCase();
        return startsWith(trans, filterString.toLowerCase())
    }

    /**
     * Сравнивает ствтус элемента и статус для фильтрации.
     * @param status Стратус элемента.
     * @param filterStatus Статус для фильтрации
     * @return {boolean} Возвращает результат проверки.
     */
    private static isStatusEqualsFilterStatus(status: Statuses, filterStatus: Statuses) {
        return !filterStatus || status === filterStatus;
    }
}