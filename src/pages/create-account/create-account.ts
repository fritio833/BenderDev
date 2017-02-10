import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CreateAccountFinalPage }from '../create-account-final/create-account-final';

/*
  Generated class for the CreateAccount page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html'
})
export class CreateAccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}


  showCreateAccountFinal() {
  	this.navCtrl.push(CreateAccountFinalPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountPage');
  }

}
