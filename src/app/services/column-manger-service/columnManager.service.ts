import {Injectable} from '@angular/core';
import {ResizeEdges} from 'app/enums/resizeEdges.enum';
import {concat} from 'lodash'
import {Observable, Subject} from 'rxjs';

@Injectable()
export class ColumnManagerService {
    private columns: any[] = [];
    private dragStartColumnIndex: number = null;

    private source = new Subject<any>();
    private observable = this.source.asObservable();

    /**
     * Возвращает массив колонок.
     */
    public getColumns(): any[] {
        return this.columns;
    }

    /**
     * Добавляет новую колонку.
     */
    public addColumn(column: any) {
        this.columns.push(column);
    }

    /**
     * Добавляет новую колонку.
     */
    public addColumns(columns: any[]) {
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
        this.source.next({type: 'body'});
    }

    /**
     * Сообщает что необходимо перерисовать шапку таблицы.
     * @param index
     * @param width
     * @param resizeEdge
     */
    public changeHeaderWidth(index: number, width: number, resizeEdge: ResizeEdges): void {
        if (width >= 65) {
            this.recalculateColumns(this.columns[index], {index, width}, resizeEdge);
            this.source.next({type: 'header'});
        }
    }

    /**
     * Перерасчитывает ширину колонок таблицы.
     * @param oldParams
     * @param newParams
     * @param resizeEdge
     */
    private recalculateColumns(oldParams, newParams, resizeEdge: ResizeEdges): void {
        const diff: number = oldParams.width - newParams.width;
        let siblingToResize: any;
        if (resizeEdge === ResizeEdges.RIGHT) {
            siblingToResize = this.columns[newParams.index + 1];
        } else if (resizeEdge === ResizeEdges.LEFT) {
            siblingToResize = this.columns[newParams.index - 1];
        }

        if (siblingToResize && siblingToResize.width + diff >= 65) {
            oldParams.width = newParams.width;
            siblingToResize.width += diff;
        }
    }

    /**
     * Получает индекс перетаскиваемой колонку.
     * @param index
     */
    public columnDragStart(index: number) {
        this.dragStartColumnIndex = index;
    }

    /**
     * Получает индекс колонки на место которой необходимо поставить перетаскиваемую колонку.
     * @param index
     */
    public columnDragEnd(index: number) {
        if (this.dragStartColumnIndex && index !== this.dragStartColumnIndex) {
            this.moveColumn(this.dragStartColumnIndex, index);
            this.dragStartColumnIndex = null;
        }
    }

    /**
     * Изменяет индекс перетаскиваемой колонки в массиве, сообщает ячейкам что им необходимо изменить индексы колонок к
     * которым они привязаны.
     * @param firstColumnIndex
     * @param secondColumnIndex
     */
    private moveColumn(firstColumnIndex: number, secondColumnIndex: number): void {
        const element = this.columns.splice(firstColumnIndex, 1)[0];
        this.columns.splice(secondColumnIndex, 0, element);
        this.source.next({type: 'move', cols: this.columns});
    }
}
