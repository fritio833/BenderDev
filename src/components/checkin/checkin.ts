import { Component,Input, Output, ChangeDetectorRef  } from '@angular/core';
import { SingletonService } from '../../providers/singleton-service';


@Component({
  selector: 'checkin',
  templateUrl: 'checkin.html'
})
//,  changeDetection: ChangeDetectionStrategy.OnPush

export class CheckinComponent {

  @Input ('checkin') checkToUse;
  public check:any;
  public beerRating:any;
  public checkinTime:string;

  constructor(public sing:SingletonService, public cdRef:ChangeDetectorRef) {
    //console.log('Hello Checkin Component');
    this.check = {};
  }

  ngOnInit() {

    this.check = this.checkToUse;

    if (this.check.beerRating == '')
      this.beerRating = 0;
    else
      this.beerRating = this.check.beerRating;

     this.checkinTime = this.getTimestamp(this.check.dateCreated);
     //this.cdRef.detectChanges();
  }

  getBackgroundImg(pic) {
    let img:any;
    img = {backgroundImage:''};
    if(pic == null || pic == '')
      return;
    else {
      img.backgroundImage = 'url('+pic+')';
      return img;
    }
  }

  getTimestamp(prevTime) {
    return this.sing.timeDifference(new Date().getTime(),prevTime,true);
  }    

}
