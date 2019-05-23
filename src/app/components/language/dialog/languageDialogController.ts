'use strict';
import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'ngbd-modal-content',
    templateUrl: './languageDialogTemplate.html'
})
export class NgbdModalContent {

    languagesList = [
        'en',
        'ru'
    ];

    selected = "ru";

    constructor(public activeModal: NgbActiveModal) {
    }

}