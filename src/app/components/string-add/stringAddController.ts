"use strict";
import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: "string-add",
    templateUrl: "./stringAddTemplate.html",
})
export class StringAdd {
    @Output() add = new EventEmitter<string>();

    onAdd(text: string) {
        this.add.emit(text);
    }

};
