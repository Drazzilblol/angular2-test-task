import {Pipe, PipeTransform} from '@angular/core';
import {filter} from 'lodash'
import {FilterParams} from "../../components/filter/models/filterParams";
import {StringListItem} from "../../components/string-list/models/StringListItem";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
    name: 'stringFilter',
    pure: false
})
export class StringFilterPipe implements PipeTransform {

    constructor(private translate: TranslateService) {
    }

    /**
     * Фильрует массив элементов StringListItem согласно данным для фильтрации.
     * @param items
     * @param filterParams
     * @return {string} Возвращает цвет компонета в зависимости от текщего статуса.
     */
    public transform(items: StringListItem[], filterParams: FilterParams) {
        let result: StringListItem[];
        if (filterParams.text && filterParams.status) {
            result = filter(items, item => {
                let tra: string = this.translate.instant(item.transformedText).toLowerCase();
                return tra.includes(filterParams.text.toLowerCase()) && item.status === filterParams.status;
            })
        } else if (filterParams.text || filterParams.status) {
            result = filter(items, item => {
                let tra: string = this.translate.instant(item.transformedText).toLowerCase();
                return tra.includes(filterParams.text.toLowerCase()) || item.status === filterParams.status;
            })
        } else {
            result = items;
        }
        return result
    }
}