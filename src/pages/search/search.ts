import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BreweryService } from '../../providers/brewery-service';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { BeerDetailPage } from '../beer-detail/beer-detail';


/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [BreweryService]
})


export class SearchPage {

  public totalResults:number;
  public numberOfPages:number;
  public beers:any;
  public currentPage:number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public beerAPI: BreweryService) {

    this.beers = navParams.get('beers');    

    
    for (var i=0;i<this.beers.length;i++) {
       console.log(this.beers[i].breweries[0].name);
    }


  }

  getBeerDetail(beerDbId) {

    this.navCtrl.push(BeerDetailPage,{beerId:beerDbId});
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    console.log(this.beers);


  }

}
