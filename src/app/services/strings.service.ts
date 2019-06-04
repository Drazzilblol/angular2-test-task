import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class StringsService {
    private stringsSource = new Subject<string>();
    private stringsObservable = this.stringsSource.asObservable();

    /**
     * Возвращает Observable, который будет возвращать строки.
     */
    getObservable(): Observable<string> {
        return this.stringsObservable;
    }

    /**
     * Излучает строку.
     * @param {number} string Излучаемая строка.
     */
    addString(string: string): void {
        this.stringsSource.next(string);
    }
}