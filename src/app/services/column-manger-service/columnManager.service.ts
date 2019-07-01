import {Injectable} from '@angular/core';
import {Columns} from 'app/enums/columns.enum';
import {find} from 'lodash';
import {Observable, Subject} from 'rxjs';
import {Column} from './column';

@Injectable()
export class ColumnManagerService {

    public columns = {
        [Columns.STATUS]: new Column(Columns.STATUS, 22, 1, false),
        [Columns.DATE]: new Column(Columns.DATE, 216, 4, true),
        [Columns.ORIGIN]: new Column(Columns.ORIGIN, 280, 3, true),
        [Columns.TRANSFORMED]: new Column(Columns.TRANSFORMED, 280, 2, true),
    };

    private stringsSource = new Subject<any>();
    private stringsObservable = this.stringsSource.asObservable();

    public getColumn(column: string): Column {
        return this.columns[column];
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
     * @param title
     * @param width
     */
    public changeHeaderWidth(title: string, width: number): void {
        if (width < 600 && width > 60) {
            this.recalculateColumns(this.columns[title], {title, width});
            this.stringsSource.next({type: 'header'});
        }
    }

    /**
     * Перерасчитывает ширину колонок таблицы.
     * @param oldOpt
     * @param newOpt
     */
    private recalculateColumns(oldOpt, newOpt): void {
        const diff: number = oldOpt.width - newOpt.width;
        const next = find(this.columns, (item) => {
            return this.columns[newOpt.title].position + 1 === item.position;
        });

        if ((next.width > 60 && newOpt.width > 60) || diff > 0) {
            this.columns[newOpt.title].width = newOpt.width;
            next.width += diff;
        }
    }
}
