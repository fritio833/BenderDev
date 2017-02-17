import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { SingletonService } from '../providers/singleton-service';


import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MyRatingsPage } from '../pages/my-ratings/my-ratings';



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
    public storage: Storage,
    public toastCtrl: ToastController,
    public auth: AuthService
  ) {
    this.initializeApp();

    storage.ready().then(()=>{

      storage.get("loggedIn").then((status)=>{
        //console.log("loggedIn!:",status);
        if (status == null) {

          storage.get('fbPic').then((fbPic)=>{

                sing.profileIMG = fbPic;

          });

          sing.loggedIn = false;
          this.rootPage = LoginPage;

        } else {
          sing.loggedIn = true;
          this.rootPage = HomePage;
        }
      });

      storage.get("userName").then((uName) =>{
        if ( uName != null )
          sing.userName = uName;
      });
      storage.get("name").then((name) =>{
          sing.realName = name;
      });

      storage.get("description").then((description) =>{
          sing.description = description;
      });             

    });


    // set our app's pages
    this.pages = [
      //{ title: 'My Pub', component: MyPubPage },
      { title: 'Home', component: HomePage },
      { title: 'Search', component: HelloIonicPage },
      { title: 'My Ratings', component: MyRatingsPage },
      { title: 'Settings', component: HomePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

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

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }    
}
