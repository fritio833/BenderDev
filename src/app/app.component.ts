import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, AlertController,ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen, Geolocation } from 'ionic-native';

import { SingletonService } from '../providers/singleton-service';
import { GoogleService } from '../providers/google-service';
import { ConnectivityService } from '../providers/connectivity-service';
import {AuthService} from '../providers/auth-service';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ProfilePage } from '../pages/profile/profile';
import { Storage } from '@ionic/storage';
import { SearchMenuPage } from '../pages/search-menu/search-menu';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{title: string, component: any}>;
  login:any;
  comp:any;
  geoInterval:any;
  geoAttempt:number = 0;


  constructor(
    public platform: Platform,
    public menu: MenuController,
    public sing: SingletonService,
    public toastCtrl: ToastController,
    public auth: AuthService,
    public geo:GoogleService,
    public storage:Storage,
    public alertCtrl: AlertController,
    public conn:ConnectivityService
  ) {
    this.initializeApp();

    this.auth.isLoggedIn().then((status)=>{
      if (status) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    });


    // set our app's pages
    this.pages = [
      //{ title: 'My Pub', component: MyPubPage },
      { title: 'Home', component: HomePage },
      { title: 'Search', component: SearchMenuPage },
      { title: 'Favorites', component: FavoritesPage },
      { title: 'Profile', component: ProfilePage },
      { title: 'Settings', component: HomePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      /*
      this.auth.isLoggedIn().then((status)=>{
        if (status)
          this.getGeolocation();
      });
      */      
      this.getGeolocation();
      
      StatusBar.styleDefault();
      Splashscreen.hide();

    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  doLogout() {
  
    this.auth.logOut().then(allowed => {
      if (allowed) {
        this.nav.setRoot(LoginPage);
        this.presentToast('Log out was successful');
        this.menu.close(); 
      }
    });
  }



  getGeolocation() {

    var temp = this;  // setInteval needs a tmp var to this.

    if (this.conn.isOnline()) {
      this.geoAttempt++;

      let options = {timeout: 5000, enableHighAccuracy: true, maximumAge:3000};
      Geolocation.getCurrentPosition(options).then((resp) => {         
         if (resp.coords.latitude) {
           this.geo.reverseGeocodeLookup(resp.coords.latitude,resp.coords.longitude)
             .subscribe((success)=>{
              this.sing.geoCity = success.city;
              this.sing.geoState = success.state;
              console.log('Geolocation with high accuracy.');
            });
         }
      }).catch((error) => {
        console.log('Error getting location using high accuracy', error);
        // Resort to low accuracy if fails
        
        temp.geoInterval = setInterval(function() {
              temp.getGeolocationLowAccuracy();
           }, 15000);        

      });
    } else {
      console.log("no connection");
      this.sing.geoCity = "Pensacola";
      this.sing.geoState = "FL";      
    }
  }

  getGeolocationLowAccuracy(){

    if (this.geoAttempt > 5) {
      clearInterval(this.geoInterval);
    }

    let options = {timeout: 10000, enableHighAccuracy: false, maximumAge:3000};
    Geolocation.getCurrentPosition(options).then((resp) => {         
       if (resp.coords.latitude) {
         this.geo.reverseGeocodeLookup(resp.coords.latitude,resp.coords.longitude)
           .subscribe((success)=>{
            this.sing.geoCity = success.city;
            this.sing.geoState = success.state;
            clearInterval(this.geoInterval);
            console.log('Geolocation with low accuracy.');
          });
       }
    }).catch((error) => {
      this.geoAttempt++;
      console.log('Error getting location using low accuracy. Attempt: ' + this.geoAttempt, error);      
    });    
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Message',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
