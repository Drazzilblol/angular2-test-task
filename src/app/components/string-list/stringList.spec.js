"use strict";

import english from "../../locales/locale-en";
import russian from "../../locales/locale-ru";

describe("string list", function () {
    let scope;
    let $translate;
    let element;


    beforeEach(angular.mock.module("listApp"));

    beforeEach(inject(function ($rootScope, $compile, _$translate_) {
        scope = $rootScope.$new();
        $translate = _$translate_;
        scope.onDeleteSpy = jasmine.createSpy("onDelete");
        element = $compile(angular.element("<strings-list on-delete='onDeleteSpy(index)' strings='strings'/>"))(scope);
    }));

    afterAll(function () {
        scope = null;
        element = null;
        $translate = null;
    });

    describe("component", function () {

        it("check string with numbers", function () {
            let testStrings = ["t1e2s3t4"];
            let resultString = "1234";
            scope.strings = testStrings;

            scope.$digest();
            expect(element.find("li").find("span").text()).toBe(resultString);
        });

        it("check items deleting", function () {
            let resultString = "12345";
            scope.strings = [resultString];

            scope.$digest();
            let firstElement = element.find("li").eq(0);
            expect(firstElement.find("span").text()).toBe(resultString);

            firstElement.find("button")
                .triggerHandler("click");
            expect(scope.onDeleteSpy).toHaveBeenCalledWith(0);

            scope.strings.splice(0, 1);
            scope.$digest();
            expect(element.find("li").eq(0).find("span").text()).not.toBe(resultString);
        });

        it("check string without numbers", function () {
            scope.strings = ["test"];

            scope.$digest();
            let firstElement = element.find("li").eq(0);
            expect(firstElement.find("span").text()).toBe(english.MESSAGE);

            $translate.use("ru");
            scope.$digest();
            expect(firstElement.find("span").text()).toBe(russian.MESSAGE);
        });

        it("check delete button localization", function () {
            scope.strings = ["test"];

            scope.$digest();
            let delButton = element.find("li")
                .eq(0)
                .find("button")
                .triggerHandler("click");
            expect(delButton.text()).toBe(english.BUTTON_DELETE);

            $translate.use("ru");
            scope.$digest();
            expect(delButton.text()).toBe(russian.BUTTON_DELETE);
        });
    });
});


