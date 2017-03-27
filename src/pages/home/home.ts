import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Geolocation } from 'ionic-native';

import { SingletonService } from '../../providers/singleton-service';
import { AuthService } from '../../providers/auth-service';

import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { BeerDetailPage } from '../beer-detail/beer-detail';
import { TackMapPage } from '../tack-map/tack-map';
import { SearchStartPage } from '../search-start/search-start';
import { SearchBeerPage } from '../search-beer/search-beer';
import { SearchLocationPage } from '../search-location/search-location';
import { SearchBreweriesPage } from '../search-breweries/search-breweries';



declare var google;
/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public choice:string;
  public beers = new Array();
  public reviews = new Array();
  public profileIMG:any;
  public drinkRating = 4;
  public locRating = 4.5;

  constructor(public navCtrl: NavController, 
  	          public sing:SingletonService,
  	          public auth:AuthService,
              public modalCtrl:ModalController,
  	          public toastCtrl:ToastController,
  	          public storage:Storage) {

  	this.choice = "home";
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    this.storage.ready().then(()=>{
       this.storage.get('fbPic').then((val) =>{
         console.log('profile pic: ' + val);
         this.profileIMG = val;
       })
    });    

    //this.initMap();
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
          this.navCtrl.push(SearchLocationPage);
          break;
        case 'breweries':
          this.navCtrl.push(SearchBreweriesPage);
          break;          
        default: console.log('not valid search');
      }      
    });
    modal.present();
  }

}
