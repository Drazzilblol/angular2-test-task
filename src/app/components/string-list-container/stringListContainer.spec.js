"use strict";

describe("string list container", function () {
    let scope;
    let element;

    beforeEach(angular.mock.module("listApp"));

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope.$new();
        element = $compile(angular.element("<strings-list-container/>"))(scope);
    }));

    afterAll(function () {
        scope = null;
        element = null;
    });

    describe("component", function () {

        it('check add item', function () {
            let testString = "12345";
            let stringAdd = element.find("string-add");

            stringAdd.find("input")
                .val(testString)
                .triggerHandler("input");
            stringAdd.find("button")
                .triggerHandler("click");
            expect(element.find("li").eq(0).find("span").text()).toBe(testString);
        });

        it('check delete item', function () {
            let resultString = "12345";
            scope.strings = [resultString];

            scope.$digest();
            element.find("li")
                .eq(0)
                .find("button")
                .triggerHandler("click");
            expect(element.find("li").eq(0).find("span").text()).not.toBe(resultString);
        });
    });
});


