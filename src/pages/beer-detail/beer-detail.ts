import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { BreweryService } from '../../providers/brewery-service';
import { SingletonService } from '../../providers/singleton-service';
import { DbService } from '../../providers/db-service';
import { Beer } from '../../models/beer';

import { LoginPage } from '../login/login';

/*
  Generated class for the BeerDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-beer-detail',
  templateUrl: 'beer-detail.html',
  providers: [BreweryService]
})
export class BeerDetailPage {

  public beerId:string;
  public beer:Beer;
  public isFavorites:boolean = false;
  public hideSave:boolean = false;
  public beerLikes:number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public beerAPI: BreweryService, public storage:Storage, public toastCtrl:ToastController, public sing:SingletonService,public db:DbService) {

    this.beerId = navParams.get('beerId');
    this.isFavorites = navParams.get('favorites');

    this.getLikeBeer(this.beerId);
    // console.log("beerid",this.beerId);

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad BeerDetailPage');



    this.beerAPI.loadBeerById(this.beerId).subscribe(beer => {
       this.beer = beer;
       this.loadBeer(this.beer);

      this.storage.ready().then(()=>{

        this.storage.get("beers").then((beerArray)=>{
        
          for (let i = 0; i < beerArray.length; i++) {
            if (beerArray[i].id == this.beer.id ){
              this.hideSave = true;
              return;
            }
          }

        });      
    
      });  

    });
  }

 
  loadBeer(data) {

    this.beer = data.data;

    //console.log('wut',this.beer);
    //console.log('name',this.beer.name);

 		
    // fix beers with no images
    if (!this.beer.hasOwnProperty('labels')) {

      this.beer['labels'] = {icon:'images/no-image.jpg',medium:'images/no-image.jpg',large:'images/no-image.jpg'};

    }

    // fix no beer category
 	if (!this.beer.hasOwnProperty('style')) {

        this.beer['style'] = {category:{name:'',createDate:'',id:''}};

    }

    // fix no description in available
    
 	if (!this.beer.hasOwnProperty('available')) {

        this.beer['available'] = {description:'',name:'',id:''};

    }
    console.log('detail',this.beer);
  }

  saveBeerToFavorites(beerId) {

    var beers = new Array();

    if (beerId == null) {

      console.log('beerId is null');

    } else {

      this.storage.ready().then(()=>{

        this.storage.get("beers").then((beerArray)=>{
        
            if (beerArray == null) {
              
              beers.push(this.beer);
              this.storage.set('beers',beers);
              this.presentToast(this.beer.name + " saved to favorites.");

            } else {

              for (let i = 0; i < beerArray.length; i++) {
                if (beerArray[i].id == beerId ){
                  this.presentToast(this.beer.name + " already saved.");
                  console.log('beer already saved ' + beerArray[i].id + ' - ' + this.beer.id);
                  return;
                }
              }

              beerArray.push(this.beer);
              this.storage.set('beers',beerArray);
              this.presentToast(this.beer.name + " saved to favorites.");

            }
        });      
    
      });
    }
  }

  removeBeerFromFavorites(beerId) {
       
      this.storage.get("beers").then((beerArray)=>{   

        for (let i = 0; i < beerArray.length; i++) {
        
          if (beerArray[i].id == beerId ){
            this.presentToast(beerArray[i].name + " removed from favorites.");
            beerArray.splice(i,1);
            this.storage.set('beers',beerArray);

            return;
          }
        }          

      });
  }

  doLogin() {

    this.navCtrl.push(LoginPage);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  } 

  setLikeBeer(beerId) {

    this.db.setLikeBeer(beerId).subscribe((value) => {
      console.log(value);
    }, (error) => {
      console.log(error);
    },() => {
      console.log('success');
      this.presentToast("You liked this beer.");
      this.getLikeBeer(beerId);
    });

  }

  getLikeBeer(beerId) {
    this.db.getLikeBeer(beerId).subscribe((value) => {
      console.log('beer likes',value.data); 
      this.beerLikes = value.data;
    }, (error) => {
      console.log(error);
    },() => {
      console.log('success');

    });

  }

}
