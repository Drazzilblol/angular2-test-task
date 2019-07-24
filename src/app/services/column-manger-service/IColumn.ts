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
    minWidth: number;
}
