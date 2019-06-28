import {Injectable} from '@angular/core';
import {filter, forEach, size} from 'lodash';
import {Observable, Subject} from 'rxjs';
import {Columns} from '../../enums/columns.enum';
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
     * Излучает элемент списка SortParams.
     * @param title
     * @param width
     */
    public changeWidth(title: string, width: number): void {
        this.recalculateColumns(this.columns[title], {title, width});
        this.columns[title].width = width;
        this.stringsSource.next();

    }

    private recalculateColumns(oldOpt, newOpt): void {
        const diff: number = oldOpt.width - newOpt.width;
        forEach(this.columns, (value, key) => {
            if (key !== newOpt.title && value.resizable && oldOpt.position < value.position) {
                this.columns[key].width = value.width + diff / (size(filter(this.columns, (col) => {
                    return col.resizable && oldOpt.position < col.position && col.width >= 110;
                })));
            }
        });
    }
}
