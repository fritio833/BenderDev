import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AuthProviders, AuthMethods, AngularFire  } from 'angularfire2';
import { Facebook } from 'ionic-native';
import firebase from 'firebase';

import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

import { SingletonService } from './singleton-service';
import { DbService } from './db-service';

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
  public currentUser: User;
  public auth:any;
  public userRef:any;
  public userExistsRef:any;
  public loggedIn:boolean;

  constructor(public sing:SingletonService, 
              public angFire:AngularFire,
              public storage:Storage,
              public platform:Platform,
              public db:DbService) {
    this.auth = firebase.auth();
    this.userRef = firebase.database();
    this.userExistsRef = firebase.database();

    
    firebase.auth().onAuthStateChanged((_currentUser) => {
        if (_currentUser) {
            console.log("User " + _currentUser.uid);
            this.storage.set('uid',_currentUser.uid);
            //console.log("currentUser",_currentUser);
            //this.loggedIn = true;
            
        } else {
            console.log("AUTH: User is logged out");
            //this.loggedIn = false;
        }
    }); 
  }

  public loginEmail(credentials) {
    var that = this;
    return new Observable(observer => {
      firebase.auth().signInWithEmailAndPassword(credentials.email,credentials.password).then(response=>{
        this.updateUserData(response);
        observer.next(true);
      }).catch(error=> {
        // Handle Errors here.
        observer.error(error);        
      });
    });
  }

  public updateUserData(resp) {
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    let updateData = {dateLoggedIn:timestamp};

    this.userRef.ref('users/' + resp.uid).update(updateData);    
  }

  public writeUserData(resp,provider,fbTok?,credName?) {
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    let displayName = null
    //console.log('resp',resp);
    if (credName!=null) {
      displayName = credName;
    } else {
      displayName = resp.displayName;
    }

    this.userRef.ref('users/' + resp.uid).set({
      uid:resp.uid,
      name:displayName,
      email:resp.email,
      dateCreated:timestamp,
      dateLoggedIn:timestamp,      
      facebookToken:fbTok,
      provider:provider,
      emailVerified: resp.emailVerified,
      checkins:0         
    });
  }
   
  public signupEmail(cred) {
    return new Promise( resolve => {

      firebase.auth().createUserWithEmailAndPassword(cred.email.value,cred.pword.value).then(resp=>{
        //console.log('resp',resp);

        this.writeUserData(resp,'email','',cred.name.value);
 
        resolve(resp);
      }).catch(error=> {
        // Handle Errors here.
        console.log('error',error);
        resolve(error);
      });

    });
  }
  
  /*
  public signupEmail(cred) {
    return new Promise( resolve => {
      
      this.angFire.auth.createUser({email:cred.email.value,password:cred.pword.value}).then(newUser=>{
        let timestamp = firebase.database.ServerValue.TIMESTAMP;
        console.log('newUser created',newUser);
        // TODO: send sendPasswordResetEmail
        this.auth.currentUser.sendEmailVerification();
        //this.writeUserData(newUser.uid,cred.name.value,cred.email.value,)

        this.userRef.ref('users/' + newUser.uid).set({
          uid: newUser.uid,
          username: cred.userName.value,
          displayName: cred.name.value,
          DOB: cred.birthDay.value, 
          email: newUser.auth.email,
          profilePicture: newUser.auth.photoURL,
          dateCreated: timestamp,
          checkins: 0,
          emailVerified: newUser.auth.emailVerified
        });

        resolve(newUser);
      }).catch(error=>{
        console.log('error',error);
        resolve(error);
      });

    });
  }
  */
  public loginFacebook() {

    return Observable.create(observer => {

      if (this.platform.is('cordova')) {
        Facebook.login(['public_profile','email']).then(facebookData => {
          //console.log('facebookData',facebookData);

          let provider = firebase.auth.FacebookAuthProvider.credential(facebookData.authResponse.accessToken);
          firebase.auth().signInWithCredential(provider).then(firebaseData => {
            //console.log('firebaseData',firebaseData);

            this.userExistsRef.ref('users/').once('value',snapshot=>{
              if (snapshot.hasChild(firebaseData.uid)) {
                //alert('exists');
                this.updateUserData(firebaseData);
                observer.next(firebaseData);
              } else {
                //alert('does not exist');
                this.writeUserData(firebaseData,'facebook',facebookData.authResponse.accessToken);
                observer.next(firebaseData);                            
              }
            });
          });
        }, error => {
          observer.error(error);
        });
      } else {
          let provider = new firebase.auth.FacebookAuthProvider();
          provider.addScope('user_birthday');
          firebase.auth().signInWithPopup(provider).then(resp=>{

          let providerFB = firebase.auth.FacebookAuthProvider.credential(resp.credential.accessToken);
          firebase.auth().signInWithCredential(providerFB).then(firebaseData => {            
            //console.log('fbresp',firebaseData);

            this.userExistsRef.ref('users/').once('value',snapshot=>{
              if (snapshot.hasChild(firebaseData.uid)) {
                //alert('exists');
                this.updateUserData(firebaseData);
                observer.next(firebaseData);
              } else {
                //alert('does not exist');
                this.writeUserData(firebaseData,'facebook',resp.credential.accessToken);
                observer.next(firebaseData);                            
              }
            });
            
          });
            //this.setLoggedIn(resp);
          }).catch(error=>{
            console.log('error facebook login',error);
            observer.next(error);
          });        
      }

    });

  }
 
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        // login could be user name.  Backend makes the check.

        this.db.loginUser(credentials)
           .subscribe(allowed => {
            //console.log(allowed);
            let access = false;

            if (allowed.status) {

              access = true;
      
              this.currentUser = new User(allowed.data.name, allowed.data.email);

              this.sing.loggedIn = true;

              this.storage.set('loggedIn',true);
              this.storage.set('token',allowed.data.token)
              this.storage.set('email',credentials.email);
              this.storage.set('userName',allowed.data.username);
              this.storage.set('name',allowed.data.name);
              this.storage.set('isFB', allowed.data.is_facebook);
              this.storage.set('fbID', allowed.data.fb_id);
              this.storage.set('fbPic', allowed.data.fb_pic);
              this.storage.set('description', allowed.data.description);

              this.setSingletonData();

            } else {
               access = false;
               console.log('login fail');
            }

            observer.next(access);
            observer.complete();

         },error => {
            console.log(error);
         });

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

  public isLoggedIn() {
    return new Promise((resolve) => {

      this.storage.ready().then(()=>{

        this.storage.get("uid").then((status) =>{
            
            if (status == null ) {
              resolve(false);
            } else {
              this.sing.loggedIn = true;
              resolve(true);
            }
        });

      });        
       //this.sing.loggedIn;
    });
  }

  public setSingletonData() {

    console.log("Setting Singleton Data");
    this.storage.ready().then(()=>{

      this.storage.get('fbPic').then((fbPic)=>{
        this.sing.profileIMG = fbPic;
      });

      this.storage.get("userName").then((uName) =>{
        if ( uName != null )
          this.sing.userName = uName;
      });
      this.storage.get("name").then((name) =>{
        if ( name != null)
            this.sing.realName = name;
      });

      this.storage.get("description").then((description) =>{
          this.sing.description = description;
      });

      this.storage.get("token").then((token) =>{
          this.sing.token = token;
      });                 

    });    
  }  
 
  public logOut() {
    let sing = this.sing;
    let stor = this.storage;
    return new Promise(resolve=>{
      firebase.auth().signOut().then(resp=>{
          stor.remove('uid');
          //console.log('logged out');
          resolve(true);
        }).catch(error=>{
          resolve(false);
          console.log('logout error',error);          
        });
    });
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;

      this.storage.ready().then(()=>{

        // store favorites before we destroy it
        this.storage.get('beers').then((beers)=>{

          console.log('beers to delete',beers);
          this.storage.get('token').then((token)=>{

              // If we have no beers to save, don't bother saving nothing.
              if(beers!=null){

                this.db.saveFavoriteBeers(token,JSON.stringify(beers)).subscribe((success)=>{
                   console.log(success);
                   //this.storage.clear();

                });
              } 
          });          
        });


  	    this.storage.remove('loggedIn');
        this.storage.remove('user');
        this.storage.remove('token');
        this.storage.remove('userName');
        this.storage.remove('name');
        this.storage.remove('email');
        this.storage.remove('isFB');
        this.storage.remove('fbID');
        this.storage.remove('fbPic');        
        this.storage.remove('description');
        this.sing.token = '';
  	    this.sing.loggedIn = false;
        
        
        observer.next(true);
        observer.complete();          

      });

    });
  }
}