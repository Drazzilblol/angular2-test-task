import config from 'app/config.json';
import {ColumnsTypes} from 'app/enums/columnsTypes.enum';
import {IColumn} from 'app/services/column-manger-service/IColumn';
import moment from 'moment';

export class Column implements IColumn {
    public width: number;
    public title: string;
    public type: ColumnsTypes;
    public name: string;
    public resizable: boolean = false;
    public sortable: boolean = false;
    public draggable: boolean = false;
    public filterable: boolean = false;
    public dateFormat: string = config.DATE.DATE_FORMAT;
    public minWidth: number = config.COLUMN.MIN_WIDTH;
    public functionValue: any;

    /**
     * Конструктор колонки.
     * @param title Название колонки.
     * @param type Тип колонки.
     * @param name Название свойства в модели данных.
     * @param width Ширина колонки.
     * @param options Необязательный набор опций:
     * resizable позволяет изменять ширину колонки,
     * sortable включает сортировку по колонке,
     * defaultSort при включеном sortable указывает что колонка будет отсортирована по умолчанию.
     * draggable позволяет изменять порядок колонок,
     * filterable включает фильтрацию по колонке,
     * minWidth минимальная ширина колонки.
     */
    constructor(title: string, type: ColumnsTypes, name: string, width: number, options?: any) {
        this.width = width;
        this.title = title;
        this.type = type;
        this.name = name;
        if (options) {
            this.functionValue = options.functionValue;
            this.resizable = options.resizable || false;
            this.sortable = options.sortable || false;
            this.draggable = options.draggable || false;
            this.filterable = options.filterable || false;
            this.dateFormat = options.dateFormat || config.DATE.DATE_FORMAT;
            this.minWidth = options.minWidth || config.COLUMN.MIN_WIDTH;
        }
    }

    public parseDate(date) {
        return moment(date.getTime()).format(this.dateFormat);
    }
}
