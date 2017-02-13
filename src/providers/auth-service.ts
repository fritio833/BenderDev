import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { SingletonService } from './singleton-service';

export class User {
  name: string;
  email: string;
 
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
 
@Injectable()
export class AuthService {
  currentUser: User;

  constructor(public sing:SingletonService,public storage:Storage) {}
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.password === "pass" && credentials.email === "lol@aol.com");
        this.currentUser = new User('Bob Saget', 'saimon@devdactic.com');
        this.sing.loggedIn = true;
        this.sing.userName = "Bob Saget";

        this.storage.set('loggedIn',true);
        this.storage.set('user',credentials.email);
        this.storage.set('userType','email');
        this.storage.set('userName','Bob Saget');

        observer.next(access);
        observer.complete();
      });
    }
  }
 
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
 
  public getUserInfo() : User {
    return this.currentUser;
  }
 
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;

      this.storage.ready().then(()=>{      
	    this.storage.remove('loggedIn');
	    this.sing.loggedIn = false;
	    observer.next(true);
	    observer.complete();
      });

    });
  }
}