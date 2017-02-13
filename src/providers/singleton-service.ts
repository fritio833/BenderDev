// App Global Variables

import { Injectable } from '@angular/core';


@Injectable()
export class SingletonService {
  public loggedIn:boolean = false;
  public userName:string = '';


}
