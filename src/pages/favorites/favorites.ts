import { Component, ApplicationRef } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { SingletonService } from '../../providers/singleton-service';

import { BeerDetailPage } from '../beer-detail/beer-detail';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';

/*
  Generated class for the Favorites page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {

  public beers = new Array();
  public choice:string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public sing:SingletonService, 
              public storage:Storage, 
              public toastCtrl: ToastController, 
              public appRef:ApplicationRef) {
    this.choice = "beerlist";  
  }

  getBeerDetail(beerDbId) {

    this.navCtrl.push(BeerDetailPage,{beerId:beerDbId,favorites:true});
    
  }  

  removeBeerFromFavorites(beerId) {
       
        this.storage.get("beers").then((beerArray)=>{   

          for (let i = 0; i < beerArray.length; i++) {
          
            if (beerArray[i].id == beerId ){
              this.presentToast(beerArray[i].name + " removed from favorites.");
              beerArray.splice(i,1);
              this.storage.set('beers',beerArray).then(()=>{
                 this.appRef.tick();              
              });

              return;
            }
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
    console.log('ionViewDidLoad FavoritesPage');

    this.storage.ready().then(()=>{

      this.storage.get('beers').then((beerArray)=>{
        this.beers = beerArray;
      });      
    
    });

  }

  doSearch() {
    this.navCtrl.push(HelloIonicPage); 
  }


  ionViewWillEnter() { 

     this.storage.ready().then(()=>{
	      this.storage.get('beers').then((beerArray)=>{
	        this.beers = beerArray;
	      }); 
     });

  }  

}
