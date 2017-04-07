import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ModalController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


import { SingletonService } from '../../providers/singleton-service';
import { BreweryService } from '../../providers/brewery-service';

import { BeerDetailPage } from '../beer-detail/beer-detail';
import { CheckinPage } from '../checkin/checkin';

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
  public loading:any;

  constructor(public navCtrl:NavController, 
              public navParams:NavParams,
              public sing:SingletonService, 
              public storage:Storage,
              public beerAPI:BreweryService,
              public actionCtrl:ActionSheetController,
              public modalCtrl:ModalController,
              public loadingCtrl:LoadingController,
              public toastCtrl:ToastController) {
    this.choice = "beerlist";  
  }

  getBeerDetail(beerDbId) {
    this.navCtrl.push(BeerDetailPage,{beerId:beerDbId,favorites:true});
  }
  
  checkinBeer(beer) {
    this.showLoading();
    this.beerAPI.loadBeerById(beer.id).subscribe(resp=>{
      this.loading.dismiss();
      console.log('beer',resp);
      if (resp.hasOwnProperty('data')) {
        let modal = this.modalCtrl.create(CheckinPage,{checkinType:'beer',beer:resp.data});
        modal.onDidDismiss(()=> {
          
        });
        modal.present();      
      }
    });
  }

  getBeerActions(beer) {
    //console.log(beer);
    
    let actionSheet = this.actionCtrl.create({
      title: beer.name,
      buttons: [
        {
          text: 'Check-in',
          handler: () => {
            this.checkinBeer(beer);
          }
        },{
          text: 'Locate',
          handler: () => {
            // TODO: Find beers locally
            // this.removeBeerFromFavorites(beer.id);            
          }
        },{
          text: 'Details',
          handler: () => {
            this.getBeerDetail(beer.id);
          }
        },{
          text: 'Suggestions',
          handler:() => {
            console.log('Suggestions Clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }  

  removeBeerFromFavorites(beerId) {
       
    this.storage.get("beers").then((beerArray)=>{   

      for (let i = 0; i < beerArray.length; i++) {
      
        if (beerArray[i].id == beerId ){
          
          beerArray.splice(i,1);

          this.storage.set('beers',beerArray).then(()=>{
             this.presentToast(beerArray[i].name + " removed from favorites.");
             this.ionViewDidLoad();              
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
        //console.log(this.beers);
      });      
    
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
    });
    this.loading.present();
  }  

  ionViewWillEnter() { 

     this.storage.ready().then(()=>{
	      this.storage.get('beers').then((beerArray)=>{
	        this.beers = beerArray;
	      }); 
     });

  }  

}
