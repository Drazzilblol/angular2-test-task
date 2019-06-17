import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FilterParams} from 'app/components/filter/models/filterParams';
import {StringListItem} from 'app/components/string-list/models/StringListItem';
import {Statuses} from 'app/enums/statuses.enum';
import {filter, startsWith} from 'lodash';

@Pipe({
    name: 'stringFilter',
    pure: false,
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
        return filter(items, (item) => {
            return this.isStringStartsWith(item.transformedText, filterParams.text)
                && this.isStatusEqualsFilterStatus(item.status, filterParams.status);
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

    /**
     * Сравнивает ствтус элемента и статус для фильтрации.
     * @param status Стратус элемента.
     * @param filterStatus Статус для фильтрации
     * @return {boolean} Возвращает результат проверки.
     */
    private isStatusEqualsFilterStatus(status: Statuses, filterStatus: Statuses) {
        return !filterStatus || status === filterStatus;
    }
}
