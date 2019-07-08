import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Column} from './column';

@Injectable()
export class ColumnManagerService {
    private columns: Column[] = [];

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
        if (width < 600 && width > 65) {
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
        const next = this.columns[++newParams.index];
        if ((next.width > 65 && newParams.width > 65) || diff > 0) {
            oldParams.width = newParams.width;
            next.width += diff;
        }
    }
}
