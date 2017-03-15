import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { BreweryService } from '../../providers/brewery-service';

@Component({
  selector: 'page-search-beer-filter',
  templateUrl: 'search-beer-filter.html'
})
export class SearchBeerFilterPage {

  public beerStyles;
  public beerCategories;
  public sortBy;
  public filter:any;

  constructor(public navCtrl: NavController,
              public view: ViewController,
              public beerAPI: BreweryService, 
  	          public params: NavParams) {

  	if (params.get("filter") == null) {
	  	this.filter = { styleId:null,
	  	                categoryId:null,
	  	                minABV:null,
	  	                minIBU:null,
	  	                showLabels:null,
	  	                isOrganic:null,
	  	                sortBy:'ASC'
	  	            };
  	} else {
  		this.filter = params.get("filter");
  	}
  }

  cancel() {
    this.view.dismiss();
  }

  updateBeerStyle(catId) {

    let styleArray = new Array();

    this.beerAPI.loadBeerStyles().subscribe((styles)=>{
      //console.log('styles',styles);
      this.beerStyles = styles.data;

      for (let i=0;i<this.beerStyles.length;i++) {
      	if (this.beerStyles[i].categoryId == catId) {
      		styleArray.push({id:this.beerStyles[i].id,
      			             shortName:this.beerStyles[i].shortName,
      			             description:this.beerStyles[i].description
      			            });
      	}
      }
      this.beerStyles = styleArray;
      //console.log(styleArray);
    });

  }

  getStyleDescription(styleId) {
  	console.log('styleid',styleId);
  }

  applyBeerFilter() {
  	this.view.dismiss(this.filter);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchBeerFilterPage');

    this.sortBy = 'ASC';

    this.beerAPI.loadBeerStyles().subscribe((styles)=>{
      this.beerStyles = styles.data;
    });
    
    this.beerAPI.loadBeerCategories().subscribe((categories)=>{
      this.beerCategories = categories.data;
      this.beerCategories.pop();
    });
  }

}
