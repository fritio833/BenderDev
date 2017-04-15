import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from 'ionic-native';

import { SingletonService } from '../../providers/singleton-service';
import { FavoritesPage } from '../favorites/favorites';
import { ProfileEditPage } from '../profile-edit/profile-edit';

import { AuthService } from '../../providers/auth-service';

import firebase from 'firebase';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public profileIMG:string = 'images/default-profile.png';
  public profileRef:any;
  public displayName:string;
  public joinedDate:any;
  public checkinCount:number;
  public loading:any;
  public isEmailVerified:any;
  public user:any;
  public uid:any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public sing: SingletonService,
              public alertCtrl: AlertController,
              public loadingCtrl:LoadingController,
              public modalCtrl:ModalController,
              public auth:AuthService,
              public storage:Storage) {

 
        //console.log('uid',uid);
        this.user = this.auth.getUser();
        console.log('WTF user',this.user);
        this.showLoading();
        if (this.user.uid != null) {
          this.uid = this.user.uid;
          
          this.profileRef = firebase.database().ref('users/'+this.uid).on('value', snapshot => {
            this.displayName = snapshot.val().name;
            if (snapshot.val().photo!=null && snapshot.val().photo !='')
              this.profileIMG = snapshot.val().photo;

            let date = new Date(snapshot.val().dateCreated);
            this.joinedDate = date.toDateString();
            this.joinedDate = this.joinedDate.substring(4,this.joinedDate.length);
            this.checkinCount = snapshot.val().checkins;
            
            if (this.user!=null) {
              //console.log('currUser',this.user);
              this.isEmailVerified = this.user.emailVerified;
            }
            this.loading.dismiss();            
          });
        }
  
  }

  editProfile() {
    let modal = this.modalCtrl.create(ProfileEditPage,{uid:this.uid});
    modal.onDidDismiss(resp => {
      console.log('resp',resp);
    });
    modal.present();   
  }

  sendVerifyEmail() {
    this.user.sendEmailVerification();
    this.presentAlert();
  }

  goToFavorites() {
    this.navCtrl.push(FavoritesPage);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }   

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Email Sent',
      subTitle: 'Click link to verify',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
