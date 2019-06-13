import {Pipe, PipeTransform} from '@angular/core';
import {filter} from 'lodash'
import {FilterParams} from "../../components/filter/models/filterParams";
import {StringListItem} from "../../components/string-list/models/StringListItem";

@Pipe({
    name: 'stringFilter',
    pure: false
})
export class StringFilterPipe implements PipeTransform {

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
                return item.text.includes(filterParams.text) && item.status === filterParams.status;
            })
        } else if (filterParams.text || filterParams.status) {
            result = filter(items, item => {
                return item.text.includes(filterParams.text) || item.status === filterParams.status;
            })
        } else {
            result = items;
        }
        return result
    }
}



