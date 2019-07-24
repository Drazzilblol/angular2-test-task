import {Injectable} from '@angular/core';
import {ColumnManagerStatuses} from 'app/enums/columnManagerStatuses.enum';
import {ResizeEdges} from 'app/enums/resizeEdges.enum';
import {IColumn} from 'app/services/column-manger-service/IColumn';
import {concat} from 'lodash';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class ColumnManagerService {
    private columns: IColumn[] = [];
    private dragStartColumnIndex: number;
    private isDragging: boolean = false;
    private source = new Subject<any>();
    private observable = this.source.asObservable();

    /**
     * Возвращает массив колонок.
     */
    public getColumns(): IColumn[] {
        return this.columns;
    }

    /**
     * Добавляет новую колонку.
     */
    public addColumn(column: IColumn): void {
        this.columns.push(column);
    }

    /**
     * Добавляет новую колонку, возвращает массив колонок.
     */
    public addColumns(columns: IColumn[]): IColumn[] {
        return this.columns = concat(this.columns, columns);
    }

    /**
     * Возвращает Observable, который будет возвращать элемены списка.
     */
    public getObservable(): Observable<any> {
        return this.observable;
    }

    /**
     * Сообщает что необходимо перерисовать тело таблицы.
     */
    public changeBodyWidth(): void {
        this.source.next({type: ColumnManagerStatuses.BODY});
    }

    /**
     * Сообщает что необходимо перерисовать шапку таблицы.
     * @param index
     * @param width
     * @param resizeEdge
     */
    public changeHeaderWidth(index: number, width: number, resizeEdge: ResizeEdges): void {
        if (width >= this.columns[index].minWidth) {
            this.recalculateColumns(this.columns[index], {index, width}, resizeEdge);
            this.source.next({type: ColumnManagerStatuses.HEADER});
        }
    }

    /**
     * Перерасчитывает ширину колонок таблицы.
     * @param oldParams
     * @param newParams
     * @param resizeEdge
     */
    private recalculateColumns(oldParams: IColumn, newParams: any, resizeEdge: ResizeEdges): void {
        const diff: number = oldParams.width - newParams.width;
        let siblingToResize: IColumn;
        if (resizeEdge === ResizeEdges.RIGHT) {
            siblingToResize = this.columns[newParams.index + 1];
        } else if (resizeEdge === ResizeEdges.LEFT) {
            siblingToResize = this.columns[newParams.index - 1];
        }

        if (siblingToResize && siblingToResize.width + diff >= siblingToResize.minWidth) {
            oldParams.width = newParams.width;
            siblingToResize.width += diff;
        }
    }

    /**
     * Получает индекс перетаскиваемой колонку.
     * @param index
     */
    public columnDragStart(index: number) {
        this.isDragging = true;
        this.dragStartColumnIndex = index;
    }

    /**
     * Получает индекс колонки на место которой необходимо поставить перетаскиваемую колонку.
     * @param index
     */
    public columnDragEnd(index: number) {
        if (this.isDragging && index !== this.dragStartColumnIndex) {
            this.moveColumn(this.dragStartColumnIndex, index);
            this.isDragging = false;
        }
    }

    /**
     * Изменяет индекс перетаскиваемой колонки в массиве, сообщает ячейкам что им необходимо изменить индексы колонок к
     * которым они привязаны.
     * @param firstColumnIndex
     * @param secondColumnIndex
     */
    private moveColumn(firstColumnIndex: number, secondColumnIndex: number): void {
        const column = this.columns.splice(firstColumnIndex, 1)[0];
        this.columns.splice(secondColumnIndex, 0, column);
        this.source.next({type: ColumnManagerStatuses.MOVE, cols: this.columns});
    }
}
