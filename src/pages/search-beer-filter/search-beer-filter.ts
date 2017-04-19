import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, PopoverController } from 'ionic-angular';
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
  public beerInfo:any;

  constructor(public navCtrl: NavController,
              public view: ViewController,
              public beerAPI: BreweryService,
              public alertCtrl: AlertController,
              public popCtrl:PopoverController,
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

  reset() {
    this.filter = { styleId:null,
                    categoryId:null,
                    minABV:null,
                    minIBU:null,
                    showLabels:null,
                    isOrganic:null,
                    sortBy:'ASC'
                };
    this.filter.minABV = 0;
    this.filter.minIBU = 0;
    this.beerInfo = null;
  }

  cancel() {
    this.view.dismiss();
  }

  presentBeerInfo() {
    
    let alert = this.alertCtrl.create({
      title: this.beerInfo.name,
      message: this.beerInfo.description,
      buttons: ['Dismiss']
    });
    alert.present();
        
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  updateBeerStyle(catId) {
    this.beerInfo = null;
    let styleArray = new Array();

    this.beerAPI.loadBeerStyles().subscribe((styles)=>{
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
    });

  }

  applyBeerFilter() {
    let error = 0;

    if (this.filter.minABV == 0)
      this.filter.minABV = null;

    if (this.filter.minIBU == 0)
      this.filter.minIBU = null;      

    if (this.filter.categoryId != null && this.filter.styleId == null) {
      this.presentAlert('You must select a beer style or unselect beer category');
      error++;
    }

    if (this.filter.styleId == null && 
          this.filter.categoryId == null &&
          this.filter.minABV == null &&
          this.filter.minIBU == null &&
          this.filter.showLabels != null &&
          this.filter.isOrganic == null) {
      this.presentAlert('You cannot searcy only by beer label');
      error++;
    }
    
    if(!error)
  	  this.view.dismiss(this.filter);
    
  }

  getBeerInfo(event) {
    let beerStyle:any;
    let foundStyle:boolean = false;
    if (event!=null && event!='') {
      //console.log('event',event);
      //beerStyle = this.beerStyles[event-1];
      for (var i=0;i<this.beerStyles.length;i++) {
        if (this.beerStyles[i].id == event) {
          beerStyle = this.beerStyles[i];
          foundStyle = true;
        }
      }
      //console.log('event2',beerStyle);       
      if (foundStyle)
        this.beerInfo = {name:beerStyle.shortName,description:beerStyle.description};
    } else {
      this.beerInfo = null;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchBeerFilterPage');

    this.sortBy = 'ASC';

    this.beerAPI.loadBeerStyles().subscribe((styles)=>{
      this.beerStyles = styles.data;
      //console.log('beerStyles',this.beerStyles);
    });
    
    this.beerAPI.loadBeerCategories().subscribe((categories)=>{
      this.beerCategories = categories.data;
      //console.log('beerCategories',this.beerCategories);
      this.beerCategories.pop();
    });
  }

}
