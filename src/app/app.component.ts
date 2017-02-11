import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar, Splashscreen } from 'ionic-native';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { ChooseCategoryPage } from '../pages/choose-category/choose-category';
import { SwipePage } from '../pages/swipe/swipe';
import { SingletonService } from '../providers/singleton';
import { MyPubPage } from '../pages/my-pub/my-pub';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HelloIonicPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public sing: SingletonService
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'My Pub', component: MyPubPage },
      { title: 'Favorite Drinks', component: CreateAccountPage },
<<<<<<< HEAD
      { title: 'Search', component: HelloIonicPage },
      { title: 'Login', component: CreateAccountPage }
=======
      { title: 'Search', component: ChooseCategoryPage },
      { title: 'Swipe', component: SwipePage }
>>>>>>> parent of 7c48660... Facebook Login
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
