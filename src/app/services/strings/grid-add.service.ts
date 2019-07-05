import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class GridAddService {
    private stringsSource = new Subject<any>();
    private stringsObservable = this.stringsSource.asObservable();

    /**
     * Возвращает Observable, который будет возвращать элемены списка.
     */
    public getObservable(): Observable<any> {
        return this.stringsObservable;
    }

    /**
     * Излучает элемент списка.
     * @param {any} item Излучаемый элемент списка.
     */
    public addItem(item: any): void {
        this.stringsSource.next(item);
    }
}
