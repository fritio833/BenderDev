import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { ChooseCategoryPage } from '../pages/choose-category/choose-category';
import { SwipePage } from '../pages/swipe/swipe';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  // rootPage: any = HelloIonicPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public storage: Storage
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'My Pub', component: HelloIonicPage },
      { title: 'Favorite Drinks', component: CreateAccountPage },
      { title: 'Search', component: ChooseCategoryPage },
      { title: 'Swipe', component: SwipePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      
      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app      


      let env = this;

      this.storage.ready().then(() => {
        
        //this.storage.set('user','mr anderson');
        //console.log('yolo',this.storage.get('user'));

        this.storage.get('user')
        .then( function (data) {
          // user is previously logged and we have his data
          // we will let him access the app
          env.nav.push(HelloIonicPage);

        }, function (error) {
          //we don't have the user data so we will ask him to log in
          env.nav.setRoot(CreateAccountPage);

        });

       },function(error){
          console.log('failed to load storage.');
       });
      

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
