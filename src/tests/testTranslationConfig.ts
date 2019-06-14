import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TestTranslationLoader} from './testTranslationLoader';

export const translateTestImport = [

    TranslateModule.forRoot({
        loader: {provide: TranslateLoader, useClass: TestTranslationLoader}
    })
];
