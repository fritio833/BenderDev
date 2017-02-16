import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { BreweryService } from '../../providers/brewery-service';
import { SingletonService } from '../../providers/singleton-service';
import { DbService } from '../../providers/db-service';
import { Beer } from '../../models/beer';

import { LoginPage } from '../login/login';
import { ReviewBeerPage } from '../review-beer/review-beer';
import { Ionic2RatingModule } from 'ionic2-rating';

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
  public beerReviews:any;
  public overallBeerRating:number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public beerAPI: BreweryService, 
    public storage:Storage, public toastCtrl:ToastController, public sing:SingletonService,public db:DbService, 
    public modalCtrl:ModalController) {

    this.beerId = navParams.get('beerId');
    this.isFavorites = navParams.get('favorites');

    this.getLikeBeer(this.beerId);
    // console.log("beerid",this.beerId);

  }

  ionViewDidLoad() {

    // console.log('ionViewDidLoad BeerDetailPage');

    this.beerAPI.loadBeerById(this.beerId).subscribe(beer => {
      this.beer = beer;
      this.loadBeer(this.beer);

      this.getBeerReviews();

      //  Hide Save button if we saved this beer already

      this.storage.ready().then(()=>{

        this.storage.get("beers").then((beerArray)=>{
      
          if (beerArray != null) {

            for (let i = 0; i < beerArray.length; i++) {
              if (beerArray[i].id == this.beer.id ){
                this.hideSave = true;
                return;
              }
            }
          }
          
        });      
    
      }); 
      

    });
  }

 
  loadBeer(data) {

    this.beer = data.data;

 		
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
    //console.log('detail',this.beer);
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

  rateBeer(beerId) {


  }

  getBeerReviews() {

     let beerRatingTotal:number = 0;
     let beerReviewCount:number = 0;
     // Get beer reviews by beer id
     this.db.getBeerReviewsById(this.beerId).subscribe(success=>{

      this.beerReviews = success.data;

     // Get overall Beer Ratings:  TODO: Create a backend make the calculation TABLE: beer_rating
      console.log('beer reviews',this.beerReviews);
      for (let i = 0; i < this.beerReviews.length; i++) {

        // if the beer rating is zero, they never bothered to rate.  Ignore.
        if (parseInt(this.beerReviews[i].beer_rating)) {
          beerRatingTotal += parseInt(this.beerReviews[i].beer_rating);
          beerReviewCount++;  
        }
      }

      this.overallBeerRating = beerRatingTotal  / beerReviewCount;


     });
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

  reviewBeer(beerId,beerName) {

    let modal = this.modalCtrl.create(ReviewBeerPage,{beerId:beerId,beerName:beerName});
    modal.onDidDismiss(()=> {
      this.getBeerReviews();
    });
    modal.present();

  }

  ionViewWillEnter() { 
       
       console.log("HERE VIEW WILL ENTER"); 

  }  


}
