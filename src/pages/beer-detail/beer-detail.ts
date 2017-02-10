import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BreweryService } from '../../providers/brewery-service';

import { Beer } from '../../models/beer';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public beerAPI: BreweryService) {

    this.beerId = navParams.get("beerId");
    

    // console.log("beerid",this.beerId);

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad BeerDetailPage');

    this.beerAPI.loadBeerById(this.beerId).subscribe(beer => {
       this.beer = beer;
       this.loadBeer(this.beer);
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
}
