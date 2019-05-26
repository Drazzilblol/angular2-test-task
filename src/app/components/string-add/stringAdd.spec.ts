'use strict';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

import {StringAdd} from './stringAddController';
import {TranslateModule} from '@ngx-translate/core';

describe('string add', function () {

    let component: StringAdd;
    let fixture: ComponentFixture<StringAdd>;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, TranslateModule.forRoot()],
            declarations: [StringAdd]
        });

    });

    beforeEach(function () {
        fixture = TestBed.createComponent(StringAdd);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });


    it('check add string', function () {
        let testString = 'test';

        component.onAdd = jasmine.createSpy('onAdd');
        let input = fixture.nativeElement.querySelector('input');
        input.value = testString;
        input.dispatchEvent(new Event('input'));
        fixture.nativeElement.querySelector('button').dispatchEvent(new Event('click'));
        expect(component.onAdd).toHaveBeenCalledWith(testString);
    });
});


