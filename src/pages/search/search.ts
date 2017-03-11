import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BreweryService } from '../../providers/brewery-service';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { BeerDetailPage } from '../beer-detail/beer-detail';
import { Beer } from '../../models/beer';

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
  public qSearchBeer:any;

  constructor(public navCtrl: NavController, public params: NavParams, public beerAPI: BreweryService) {

    this.beers = this.fixBeers(params.get('beers'));
    this.totalResults = params.get('totalResults');
    this.numberOfPages = params.get('numbeOfPages');
    this.qSearchBeer = params.get('qSearchBeer');
    this.currentPage = 1;

    console.log('totRes',this.totalResults);
    console.log('numPages',this.numberOfPages);
    console.log('qSearchBeer',this.qSearchBeer);
  }

  getBeerDetail(beerDbId) {

    this.navCtrl.push(BeerDetailPage,{beerId:beerDbId});
    
  }

  fixBeers(beers) {

    for (var i=0;i<beers.length;i++) {

      if (!beers[i].hasOwnProperty('breweries')) {
        beers[i]['breweries'] = new Array({name:''}); // fix beers without breweries
      }

      // fix beers with no images
      if (!beers[i].hasOwnProperty('labels')) {
        beers[i]['labels'] = {icon:'images/no-image.jpg',medium:'images/no-image.jpg',large:'images/no-image.jpg'};
      }
    }
    return beers;
  }

  getMoreBeers(infiniteScroll) {

    if (this.currentPage < this.numberOfPages) {
      this.currentPage++;
    }

    setTimeout(() => {
      this.beerAPI.loadBeerByName(this.qSearchBeer,this.currentPage).subscribe((beer)=>{
        let beersNext:any;
        beersNext = this.fixBeers(beer.data);

        for (var i = 0; i < beersNext.length; i++) {
          this.beers.push(beersNext[i]);
        }
        //console.log(beersNext);
        infiniteScroll.complete();

        if (this.currentPage == this.numberOfPages)
          infiniteScroll.enable(false);

      });
    }, 1000);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    //console.log(this.beers);
  }
}
