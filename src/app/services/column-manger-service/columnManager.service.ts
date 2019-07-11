import {Injectable} from '@angular/core';
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

    public columnDragStart(index) {
        this.dragStartColumnIndex = index;
    }

    public columnDragEnd(index) {
        if (this.dragStartColumnIndex && index !== this.dragStartColumnIndex) {
            this.swapColumns(this.dragStartColumnIndex, index);
            this.dragStartColumnIndex = null;
        }
    }

    private swapColumns(firstColumnIndex: number, secondColumnIndex: number): void {
        const firstColumn = this.columns[firstColumnIndex];
        const fcRes = firstColumn.resizable;
        const secondColumn = this.columns[secondColumnIndex];
        firstColumn.resizable = secondColumn.resizable;
        secondColumn.resizable = fcRes;
        this.columns.splice(firstColumnIndex, 1, secondColumn);
        this.columns.splice(secondColumnIndex, 1, firstColumn);
        this.source.next({type: 'swap', fIndex: firstColumnIndex, sIndex: secondColumnIndex});
    }
}
