import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { SingletonService } from '../providers/singleton-service';

import { SwipePage } from '../pages/swipe/swipe';
import { MyPubPage } from '../pages/my-pub/my-pub';
import { LoginPage } from '../pages/login/login';


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
    public storage: Storage
  ) {
    this.initializeApp();

    storage.ready().then(()=>{

      storage.get("loggedIn").then((status)=>{
        //console.log("loggedIn!:",status);
        if (status == null) {
          sing.loggedIn = false;
          this.rootPage = LoginPage
        } else {
          sing.loggedIn = true;
          this.rootPage = MyPubPage;
        }
      });

      storage.get("userName").then((uName) =>{
        if ( uName != null )
          sing.userName = uName;
      });

    });


    console.log('loginstatus', sing.loggedIn);
    // set our app's pages
    this.pages = [
      { title: 'My Pub', component: MyPubPage },
      { title: 'Favorite Drinks', component: LoginPage },
      { title: 'Search', component: HelloIonicPage }
      // { title:  this.login, component: this.comp } TODO: Figure out to refresh menu
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
}
