import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Geolocation } from 'ionic-native';

import { SingletonService } from '../../providers/singleton-service';
import { AuthService } from '../../providers/auth-service';

import { LoginPage } from '../login/login';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { BeerDetailPage } from '../beer-detail/beer-detail';

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

  @ViewChild('map') mapElement;

  public choice:string;
  public beers = new Array();
  public reviews = new Array();
  public map:any;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams, 
  	          public sing:SingletonService,
  	          public auth:AuthService, 
  	          public toastCtrl:ToastController,
  	          public storage:Storage) {

  	this.choice = "home";
    this.loadFavoriteBeers();
  }

  loadFavoriteBeers() {
    this.storage.ready().then(()=>{

      this.storage.get('beers').then((beerArray)=>{
        this.beers = beerArray;
      });

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    //setTimeout(() => { this.initMap(),3000});
    this.initMap();

	  this.storage.get('fbPic').then((fbPic)=>{
	        this.sing.profileIMG = fbPic;
	  });

	  this.storage.get('description').then((description)=>{
	        this.sing.description = description;
	  });	  

  }

  initMap() {

    Geolocation.getCurrentPosition().then((resp) => {
       if (resp.coords.latitude) {

         let latlng = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
         
         let mapOptions = {
           center:latlng,
           zoom:15,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         };

         this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions);
        
       }
    }).catch((error) => {
      console.log('Error getting location', error);
    }); 
  }

  doLogout() {
  
    this.auth.logout().subscribe(allowed => {
      if (allowed) {
        this.navCtrl.setRoot(LoginPage);
        this.presentToast('Log out was successful');      
      }
    });
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


  getBeerDetail(beerDbId) {

    this.navCtrl.push(BeerDetailPage,{beerId:beerDbId});
    
  }

  // reload favorites after added
  ionViewWillEnter() { 

    this.loadFavoriteBeers()

  }  

}
