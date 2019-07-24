import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {IColumn} from 'app/services/column-manger-service/IColumn';

export class Column implements IColumn {
    public width: number;
    public title: string;
    public type: ColumnsTypes;
    public dataFieldName: string;
    public resizable: boolean;
    public sortable: boolean;
    public defaultSort: boolean;
    public draggable: boolean;
    public filterable: boolean;
    public minWidth: number;

    /**
     * Конструктор колонки.
     * @param title Название колонки.
     * @param type Тип колонки.
     * @param dataFieldName Название свойства в модели данных.
     * @param width Ширина колонки.
     * @param options Необязательный набор опций:
     * resizable позволяет изменять ширину колонки,
     * sortable включает сортировку по колонке,
     * defaultSort при включеном sortable указывает что колонка будет отсортирована по умолчанию.
     * draggable позволяет изменять порядок колонок,
     * filterable включает фильтрацию по колонке,
     * minWidth минимальная ширина колонки.
     */
    constructor(title: string, type: ColumnsTypes, dataFieldName: string, width: number, options?: any) {
        this.width = width;
        this.title = title;
        this.type = type;
        this.dataFieldName = dataFieldName;
        if (options) {
            this.resizable = options.resizable || false;
            this.sortable = options.sortable || false;
            this.defaultSort = options.defaultSort || false;
            this.draggable = options.draggable || false;
            this.filterable = options.filterable || false;
            this.minWidth = options.minWidth || 0;
        }
    }
}
