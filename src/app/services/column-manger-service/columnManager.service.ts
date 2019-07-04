import {Injectable} from '@angular/core';
import {Columns} from 'app/enums/columns.enum';
import {Observable, Subject} from 'rxjs';
import {Column} from './column';

@Injectable()
export class ColumnManagerService {
    public columns: Column[] = [
        new Column(Columns.STATUS, '', 'status', 24, false, false),
        new Column(Columns.TRANSFORMED, Columns.TRANSFORMED, 'transformedText', 280, true, true),
        new Column(Columns.ORIGIN, Columns.ORIGIN, 'originText', 280, true, true),
        new Column(Columns.DATE, Columns.DATE, 'parsedDate', 216, false, true),
    ];

    private stringsSource = new Subject<any>();
    private stringsObservable = this.stringsSource.asObservable();

    public getColumns(): Column[] {
        return this.columns;
    }

    /**
     * Возвращает Observable, который будет возвращать элемены списка.
     */
    public getObservable(): Observable<any> {
        return this.stringsObservable;
    }

    /**
     * Сообщает что необходимо перерисовать тело таблицы.
     * @param title
     */
    public changeBodyWidth(title: string): void {
        this.stringsSource.next({type: 'body'});
    }

    /**
     * Сообщает что необходимо перерисовать шапку таблицы.
     * @param index
     * @param width
     */
    public changeHeaderWidth(index: number, width: number): void {
        if (width < 600 && width > 60) {
            this.recalculateColumns(this.columns[index], {index, width});
            this.stringsSource.next({type: 'header'});
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

        if ((next.width > 60 && newParams.width > 60) || diff > 0) {
            oldParams.width = newParams.width;
            next.width += diff;
        }
    }
}
