import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, AlertController,ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { SingletonService } from '../providers/singleton-service';
import { GoogleService } from '../providers/google-service';
import { ConnectivityService } from '../providers/connectivity-service';

import { Geolocation } from 'ionic-native';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ProfilePage } from '../pages/profile/profile';



import {AuthService} from '../providers/auth-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any;
  pages: Array<{title: string, component: any}>;
  login:any;
  comp:any;


  constructor(
    public platform: Platform,
    public menu: MenuController,
    public sing: SingletonService,
    public toastCtrl: ToastController,
    public auth: AuthService,
    public geo:GoogleService,
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
      { title: 'Search', component: HelloIonicPage },
      { title: 'Favorites', component: FavoritesPage },
      { title: 'Profile', component: ProfilePage },
      { title: 'Settings', component: HomePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.setSingletonData();
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
  
    this.auth.logout().subscribe(allowed => {
      if (allowed) {
        this.nav.setRoot(LoginPage); 
        this.presentToast('Log out was successful');
        this.menu.close(); 
      }
    });
  }



  getGeolocation() {

    if (this.conn.isOnline()) {
      Geolocation.getCurrentPosition().then((resp) => {
         if (resp.coords.latitude) {
           this.geo.reverseGeocodeLookup(resp.coords.latitude,resp.coords.longitude)
             .subscribe((success)=>{
              this.sing.geoCity = success.city;
              this.sing.geoState = success.state;                       
            });
          
         }
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    } else {
      console.log("no connection");
      this.sing.geoCity = "Pensacola";
      this.sing.geoState = "FL";      
    }
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
