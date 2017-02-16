import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { SingletonService } from '../../providers/singleton-service';
import { AuthService } from '../../providers/auth-service';

import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { FavoritesPage } from '../favorites/favorites';
import { ProfilePage } from '../profile/profile';
import { ReviewsPage } from '../reviews/reviews';
import { FriendsPage } from '../friends/friends';
import { LoginPage } from '../login/login';

/*
  Generated class for the MyPub page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-pub',
  templateUrl: 'my-pub.html'
})
export class MyPubPage {

  tab1Root: any = ProfilePage;
  tab2Root: any = FavoritesPage;
  tab3Root: any = ReviewsPage;
  tab4Root: any = FriendsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sing: SingletonService, public auth:AuthService,public toastCtrl:ToastController) {
    

  }


  doLogout() {
  
    this.auth.logout().subscribe(allowed => {
      if (allowed) {
        this.navCtrl.setRoot(LoginPage); 
        this.presentToast('Log out was successful');      
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyPubPage');
  }

  doSearch() {
  
    this.navCtrl.setRoot(HelloIonicPage);

  }

}
