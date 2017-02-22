import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Geolocation} from 'ionic-native';

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
  public latitude:string;
  public longitude:string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public sing: SingletonService, 
              public storage:Storage) {

    Geolocation.getCurrentPosition().then(pos => {
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    });
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    
    this.storage.ready().then(()=>{
       this.storage.get('fbPic').then((val) =>{
         console.log('profile pic: ' + val);
         this.profileIMG = val;
       })
    });

    this.storage.get('description').then((description)=>{
          this.sing.description = description;
    });    

  }

}
