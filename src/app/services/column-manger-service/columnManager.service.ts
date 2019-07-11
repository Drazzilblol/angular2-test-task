import {Injectable} from '@angular/core';
import {size} from 'lodash';
import {Observable, Subject} from 'rxjs';
import {Column} from './column';

@Injectable()
export class ColumnManagerService {
    private columns: Column[] = [];
    private dragStartColumnIndex: number = null;

    private source = new Subject<any>();
    private observable = this.source.asObservable();

    /**
     * Возвращает массив колонок.
     */
    public getColumns(): Column[] {
        return this.columns;
    }

    /**
     * Добавляет новую колонку.
     */
    public addColumn(column: Column) {
        this.columns.push(column);
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
     */
    public changeHeaderWidth(index: number, width: number): void {
        if (width >= 65) {
            this.recalculateColumns(this.columns[index], {index, width});
            this.source.next({type: 'header'});
        }
    }

    /**
     * Перерасчитывает ширину колонок таблицы.
     * @param oldParams
     * @param newParams
     */
    private recalculateColumns(oldParams, newParams): void {
        const diff: number = oldParams.width - newParams.width;
        const next = this.columns[newParams.index + 1];
        if (next.width + diff >= 65 || diff > 0) {
            oldParams.width = newParams.width;
            next.width += diff;
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
        const columnsSize = size(this.columns);
        if (columnsSize - 1 === firstColumnIndex) {
            this.columns[columnsSize - 1].resizable = true;
            this.columns[columnsSize - 2].resizable = false;
        } else if (columnsSize - 1 === secondColumnIndex) {
            this.columns[columnsSize - 1].resizable = true;
            this.columns[firstColumnIndex].resizable = false;
        }
        const element = this.columns.splice(firstColumnIndex, 1)[0];
        this.columns.splice(secondColumnIndex, 0, element);
        this.source.next({type: 'move', cols: this.columns});
    }
}
