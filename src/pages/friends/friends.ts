import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SingletonService } from '../../providers/singleton-service';

/*
  Generated class for the Friends page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public sing: SingletonService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }

}
