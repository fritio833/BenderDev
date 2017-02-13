import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SingletonService } from '../../providers/singleton-service';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public sing: SingletonService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
