import { Component,Input, Output } from '@angular/core';
import { SingletonService } from '../../providers/singleton-service';

@Component({
  selector: 'checkin',
  templateUrl: 'checkin.html'
})
export class CheckinComponent {

  @Input ('checkin') check;


  constructor(public sing:SingletonService) {
    console.log('Hello Checkin Component');
  }

  ngAfterViewInit() {
    //console.log('checkin',this.check);
    //this.check = this.checkin;
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
