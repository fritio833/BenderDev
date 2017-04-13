import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ModalController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';

import { SingletonService } from '../../providers/singleton-service';
import { BreweryService } from '../../providers/brewery-service';

import { BeerDetailPage } from '../beer-detail/beer-detail';
import { CheckinPage } from '../checkin/checkin';


@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {

  public beers = new Array();
  public choice:string;
  public loading:any;
  public favBeerRef:any;
  public favBeers: FirebaseListObservable<any>;
  public uid:any;

  constructor(public navCtrl:NavController, 
              public navParams:NavParams,
              public sing:SingletonService, 
              public storage:Storage,
              public beerAPI:BreweryService,
              public actionCtrl:ActionSheetController,
              public modalCtrl:ModalController,
              public angFire:AngularFire,
              public loadingCtrl:LoadingController,
              public toastCtrl:ToastController) {
    this.choice = "beerlist";

    this.storage.ready().then(()=>{
      this.storage.get('uid').then(uid=>{
        this.favBeers = this.angFire.database.list('/favorite_beers/'+uid+'/');      
      });
    });    
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
    
    console.log('favbeers',this.favBeers);

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
