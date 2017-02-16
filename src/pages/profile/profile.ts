import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

  public profileIMG:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sing: SingletonService, public storage:Storage) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    
    this.storage.ready().then(()=>{
       this.storage.get('fbPic').then((val) =>{
         this.profileIMG = val;
       })
    });

  }

}