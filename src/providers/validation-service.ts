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

    static checkConfirmPassword(control) {
        if (control.value == control.root.value['pword']) {
            return null;
        } else {
            return { 'invalidConfirmPassword': true };
        }        
    }

    static ageValidator(control) {
  
        let age = 0;
        let birthDate = new Date(control.value);
    	let ageDiffMinutes = Date.now() - birthDate.getTime();
    	let ageDate = new Date(ageDiffMinutes);

        age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if ( age >= 21) {
          return null;
        } else {
          return { 'invalidDrinkingAge' : true};        
        }
    }

    static duplicateUsername(control) {


    }

    /*
    static duplicateUsername(control) {
       console.log('yo',control.value);
       return null;
    }
    */    

    static mustBeTrue(control) {
      
      if (control.value) {
        return null;
      } else {
        return {'invalidMustBeTrue' : true };
      }
    }

}