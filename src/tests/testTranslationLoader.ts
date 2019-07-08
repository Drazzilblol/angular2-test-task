import {TranslateLoader} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import english from '../app/locales/locale-en.json';
import russian from '../app/locales/locale-ru.json';

export class TestTranslationLoader implements TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        if (lang === 'en') {
            return of(english);
        } else if (lang === 'ru') {
            return of(russian);
        }
    }
}
