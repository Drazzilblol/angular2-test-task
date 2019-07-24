import {ColumnsTypes} from 'app/enums/columnsTypes.enum';

export interface IColumn {
    width: number;
    title: string;
    type: ColumnsTypes;
    dataFieldName: string;
    resizable: boolean;
    sortable: boolean;
    defaultSort: boolean;
    draggable: boolean;
    filterable: boolean;
    minWidth: number;
}
