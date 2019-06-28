import {Injectable} from '@angular/core';
import {filter, forEach, size} from 'lodash';
import {Observable, Subject} from 'rxjs';
import {Columns} from '../../enums/columns.enum';
import {Column} from './column';

@Injectable()
export class ColumnManagerService {

    private columns = {
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
        this.recalculateHeaderColumns(this.columns[title].width, width);
        this.columns[title].width = width;
        this.stringsSource.next({title, width});

    }

    private recalculateHeaderColumns(oldOpt, newOpt): void {
        const diff: number = oldOpt - newOpt;
        forEach(this.columns, (value, key) => {
            if (key !== newOpt.title && value.resizable) {
                this.columns[key].width = value.width + diff / (size(filter(this.columns, 'resizable')) - 1);
            }
        });
    }
}
