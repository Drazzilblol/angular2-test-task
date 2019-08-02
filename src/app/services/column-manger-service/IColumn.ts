import {ColumnsTypes} from 'app/enums/columnsTypes.enum';

export interface IColumn {
    width: number;
    title: string;
    type: ColumnsTypes;
    name: string;
    resizable: boolean;
    sortable: boolean;
    draggable: boolean;
    filterable: boolean;
    minWidth: number;
}
