"use strict";

import english from "../../locales/locale-en";
import russian from "../../locales/locale-ru";

describe("string add", function () {
    beforeEach(angular.mock.module("listApp"));

    let scope;
    let $translate;
    let element;

    beforeEach(inject(function ($rootScope, $compile, _$translate_) {
        scope = $rootScope.$new();
        $translate = _$translate_;
        scope.onAddSpy = jasmine.createSpy("onAdd");
        element = $compile(angular.element("<string-add on-add='onAddSpy(text)'/>"))(scope);
        scope.$digest();
    }));

    afterAll(function () {
        scope = null;
        element = null;
        $translate = null;
    });

    describe("component", function () {

        it("check is add button disabled with empty input", function () {
            let button = element.find("button");
            expect(button.attr("disabled")).toBe("disabled");

            let input = element.find("input");
            input.val("          ")
                .triggerHandler("input");
            expect(button.attr("disabled")).toBe("disabled");
        });

        it("check add string", function () {
            let testString = "test";

            let input = element.find("input");
            input.val(testString).triggerHandler("input");
            element.find("button")
                .triggerHandler("click");
            expect(scope.onAddSpy).toHaveBeenCalledWith(testString);
        });

        it("check localization", function () {
            let button = element.find("button");
            expect(button.text().trim()).toBe(english.BUTTON_ADD);

            $translate.use("ru");
            scope.$digest();
            expect(button.text().trim()).toBe(russian.BUTTON_ADD);
        });
    });
});


