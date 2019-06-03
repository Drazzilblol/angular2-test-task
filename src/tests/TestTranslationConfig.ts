import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TestTranslationLoader} from './TestTranslationLoader';

export const translateTestImport = [

    TranslateModule.forRoot({
        loader: {provide: TranslateLoader, useClass: TestTranslationLoader}
    })
];
