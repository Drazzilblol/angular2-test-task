import {IGridItem} from 'app/components/string-add/models/IGridItem';

export interface IColumn {
    width: number;
    title: string;
    dataFieldName: string;
    resizable: boolean;
    sortable: boolean;
    defaultSort: boolean;
    draggable: boolean;
    filterable: boolean;
    date: boolean;

    /**
     * В зависимости от колонки возвращает шаблон для отображения соответствующего свойства из модели.
     * @param item: StringGridItem
     */
    functionValue(item: IGridItem);
}
