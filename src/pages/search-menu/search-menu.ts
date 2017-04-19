import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchBeerPage } from '../search-beer/search-beer';
import { SearchLocationPage } from '../search-location/search-location';
import { SearchBreweriesPage } from '../search-breweries/search-breweries';
import { ProfilePage } from '../profile/profile';


@Component({
  selector: 'page-search-menu',
  templateUrl: 'search-menu.html'
})
export class SearchMenuPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  doSearch(page) {

    switch(page) {

      case 'beers':
        this.navCtrl.push(SearchBeerPage); 
        break;
      case 'locations':
        this.navCtrl.push(SearchLocationPage,{searchType:'nearbysearch'});
        break;
      case 'breweries':
        this.navCtrl.push(SearchBreweriesPage);
        break;
      case 'bars':
        this.navCtrl.push(SearchLocationPage,{placeType:'bar',searchType:'textsearch'});
        break;                  
      default: console.log('not valid search');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchMenuPage');
  }

}
