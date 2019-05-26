Error.stackTraceLimit = Infinity;
import 'core-js/es7/reflect';

import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import {getTestBed} from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';


let appContext = require.context('./src', true, /\.spec\.ts/);

appContext.keys().forEach(appContext);


getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());