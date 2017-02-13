import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SuccessPage } from '../success/success';

/*
  Generated class for the CreateAccountFinal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-account-final',
  templateUrl: 'create-account-final.html'
})
export class CreateAccountFinalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}



  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountFinalPage');
  }

}
