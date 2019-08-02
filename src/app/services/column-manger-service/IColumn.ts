import {ColumnsTypes} from 'app/enums/columnsTypes.enum';

export interface IColumn {
    /**
     * Ширина колонки.
     */
    width: number;
    /**
     * Название колонки.
     */
    title: string;
    /**
     * Тип колнки. Может быть STATUS, DATE, TEXT.
     */
    type: ColumnsTypes;
    /**
     * Имя колонки.
     */
    name: string;
    /**
     * Разрешение на изменение ширины колоки
     */
    resizable: boolean;
    /**
     * Разрешение на сортировку.
     */
    sortable: boolean;
    /**
     * Разрешение на перетягивание колонки.
     */
    draggable: boolean;
    /**
     * Разрешение на фильтрацию по колонке.
     */
    filterable: boolean;
    /**
     * Минимальная ширина колонки.
     */
    minWidth: number;
    /**
     * Функция с помощью которой можно получить значение из модели.
     */
    functionValue: any;
}
