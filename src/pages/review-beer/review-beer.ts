import { Component} from '@angular/core';
import { NavController, ViewController, NavParams, ToastController } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';

import { Storage } from '@ionic/storage';
import { DbService } from '../../providers/db-service';

/*
  Generated class for the ReviewBeer page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-review-beer',
  templateUrl: 'review-beer.html'
})

export class ReviewBeerPage {

  public BeerId:any;
  public BeerName:any;
  public beerRating = 0;
  public beerReview = '';
  public beerPic = '';

  constructor(public navCtrl: NavController, 
              public params: NavParams, 
              public view: ViewController, 
              public db:DbService,
              public storage:Storage, 
              public toastCtrl:ToastController) {

     this.BeerId = params.get('beerId');
     this.BeerName = params.get('beerName');
     this.beerPic = params.get('beerPic');

     //console.log('BeerId', this.BeerId);
  }
  

  cancel() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewBeerPage');
  }

  submitBeerReview() {

    this.storage.get("token").then((tok) => {

      this.db.writeBeerReview(tok,this.beerReview,this.beerRating,this.BeerId).subscribe((data)=> {

         if (data.status) {

            let reviewStruct:any;

            // Store            
            this.storage.ready().then(()=>{

              this.storage.get("reviews").then((reviewArray)=>{

                  let date = new Date();
                  let currentDate = '';
                  currentDate = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2);
                  reviewStruct = {
                                  review_id:data.data,
                                  name:this.BeerName,
                                  beer_id:this.BeerId, 
                                  review:this.beerReview,
                                  rating:this.beerRating,
                                  date_created:currentDate,
                                  img:this.beerPic
                                };

                if( reviewArray == null) {
                   let tmpReview = new Array();
                   tmpReview.push(reviewStruct); 
                   this.storage.set('reviews',tmpReview);
                } else {
                  console.log('img',this.beerPic);
                  reviewArray.push(reviewStruct);
                  this.storage.set('reviews',reviewArray);
                }

              });

            });
           
           this.presentToast("Review Submitted");
           this.cancel();
         }
      },(error)=>{
         console.log('error',error);
      });
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
