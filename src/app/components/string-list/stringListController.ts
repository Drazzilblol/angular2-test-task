"use strict";

import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: "strings-list",
    templateUrl: "./stringListTemplate.html",
})
export class StringList {

    @Input() strings = [];

    @Output() delete = new EventEmitter<string>();

    onDelete(index: string) {
        this.delete.emit(index);
    }
};


