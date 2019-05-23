'use strict';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {Component} from '@angular/core';

import {NgbdModalContent} from './dialog/languageDialogController';

@Component({
    selector: 'language',
    templateUrl: './languageTemplate.html'
})
export class Language {
    constructor(private modalService: NgbModal) {
    }

    open() {
        this.modalService.open(NgbdModalContent);
    }

}



