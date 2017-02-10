import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import {FbProvider} from '../../providers/fb-provider';


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

  public email:any;
  public name:any;
  public id:any;
  public picture:any;
  public gender:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FbProvider,public alertCtrl: AlertController) {}


  showCreateAccountFinal() {
  	this.navCtrl.push(CreateAccountFinalPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountPage');
  }

  login() {
    this.fb.login().then(() => {
      this.fb.getCurrentUserProfile().then(
        (profileData) => {
          this.email = profileData.email;
          this.name = profileData.name;
          this.id = profileData.id;
          this.gender = profileData.gender;
          this.picture = "https://graph.facebook.com/" + profileData.id + "/picture?type=large";
      });
    });
  }

  logout() {
    
    this.fb.logout();

  }

    showAlert(msg) {

      let alert = this.alertCtrl.create({
        title: "wtf" + msg,
        subTitle: "*" + msg + "*",
        buttons: ['Dismiss']
      });
      alert.present();

    }  

}