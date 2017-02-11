import {Component, Inject} from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable()

export class ValidationService {

    static emailValidator(control) {
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
        if (emailPattern.test(control.value)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

}