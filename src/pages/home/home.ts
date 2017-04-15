import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Geolocation } from 'ionic-native';

import { SingletonService } from '../../providers/singleton-service';

import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { BeerDetailPage } from '../beer-detail/beer-detail';
import { TackMapPage } from '../tack-map/tack-map';
import { SearchStartPage } from '../search-start/search-start';
import { SearchBeerPage } from '../search-beer/search-beer';
import { SearchLocationPage } from '../search-location/search-location';
import { SearchBreweriesPage } from '../search-breweries/search-breweries';
import { ProfilePage } from '../profile/profile';

import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public beers = new Array();
  public reviews = new Array();
  public profileIMG:string = 'images/default-profile.png';
  public displayName:string = '';
  public drinkRating = 4;
  public locRating = 4.5;
  public profileRef:any;
  public checkinCount:number;
  public joinedDate:any;
  public getProfile:boolean = true;
  public loading:any;

  constructor(public navCtrl: NavController, 
  	          public sing:SingletonService,
              public modalCtrl:ModalController,
              public loadingCtrl:LoadingController,
  	          public toastCtrl:ToastController,
  	          public storage:Storage) {

  }

  getProfileData() {

    this.storage.ready().then(()=>{
      this.storage.get('uid').then(uid=>{
        console.log('uid',uid);
        this.showLoading();
        if (uid != null) {
          this.profileRef = firebase.database().ref('users/'+uid).once('value').then(snapshot => {
            //console.log('snap',snapshot.val());
           
            this.checkinCount = snapshot.val().checkins;

            let date = new Date(snapshot.val().dateCreated);
            this.joinedDate = date.toDateString();
            this.joinedDate = this.joinedDate.substring(4,this.joinedDate.length);
            this.displayName = snapshot.val().name;

            if (snapshot.val().photo!=null && snapshot.val().photo !='')
              this.profileIMG = snapshot.val().photo;
            
            this.loading.dismiss();
          });
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage'); 
    this.getProfileData();
  }

  doSearch() {
  	this.navCtrl.push(HelloIonicPage); 
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  goTackMap() {
    this.navCtrl.push(TackMapPage);
  }

  goToProfile() {
    this.navCtrl.setRoot(ProfilePage);
  }

  startSearch() {

    let modal = this.modalCtrl.create(SearchStartPage);
    modal.onDidDismiss(data => {
      //console.log('page',data);
      switch(data) {

        case 'beers':
          this.navCtrl.push(SearchBeerPage); 
          break;
        case 'locations':
          this.navCtrl.push(SearchLocationPage,{searchType:'nearbysearch'});
          break;
        case 'breweries':
          this.navCtrl.push(SearchBreweriesPage);
          break;
        case 'bars':
          this.navCtrl.push(SearchLocationPage,{placeType:'bar',searchType:'textsearch'});
          break;                  
        default: console.log('not valid search');
      }      
    });
    modal.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();
  }   
}
