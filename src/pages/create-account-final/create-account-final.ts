import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {}

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 2500
    });

    loader.present();

	  setTimeout(() => {
	    this.navCtrl.push(SuccessPage);
	  }, 2000);
  
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountFinalPage');
  }

}
