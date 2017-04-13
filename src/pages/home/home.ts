import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';
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
  public user:any;
  public drinkRating = 4;
  public locRating = 4.5;

  constructor(public navCtrl: NavController, 
  	          public sing:SingletonService,
              public modalCtrl:ModalController,
  	          public toastCtrl:ToastController,
  	          public storage:Storage) {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.photoURL!=null)
          this.profileIMG = user.photoURL;
        if (user.displayName!=null)
          this.displayName = user.displayName;
        //console.log('user',user);
      }
    });
       
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
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

}
