import { Component } from '@angular/core';
import { NavController, NavParams, ViewController,LoadingController,AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';


import { ValidationService } from '../../providers/validation-service';
import { DbService } from '../../providers/db-service';
import { AuthService } from '../../providers/auth-service';

import { MyPubPage } from '../my-pub/my-pub';
import { SuccessPage } from '../success/success';
import { HomePage } from '../home/home';




@Component({
  selector: 'page-create-account-final',
  templateUrl: 'create-account-final.html'
})
export class CreateAccountFinalPage {

  public email:any;
  public name:any;
  public userName:any;
  public pword:any;
  public birthDay:any
  public gender:any;
  public newUserForm:any;
  public agree:boolean;
  public submitAttempt;
  public duplicateUser:boolean;
  public duplicateEmail:boolean;
  public loading:any;
  public loginCredentials = {email: '', password: ''};


  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public view: ViewController,
              public form: FormBuilder, 
              public db: DbService,
              public loadingCtrl: LoadingController, 
              public alertCtrl: AlertController, 
              public auth:AuthService) {

     this.duplicateUser = false;
     this.duplicateEmail = false;

  	 this.newUserForm = this.form.group({
  	  email : ['',Validators.compose([Validators.required, 
  	              Validators.maxLength(30),
  	              ValidationService.emailValidator])],
  	  name : ['',Validators.compose([Validators.required,
  	                  Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(30)])],
  	  birthDay : ['',Validators.compose([Validators.required,ValidationService.ageValidator])],
  	  agree : [false,Validators.compose([Validators.required,ValidationService.mustBeTrue])],
  	  pword : ['',
  	            Validators.compose([Validators.required,
  	            Validators.maxLength(30)])],
      repword : ['',
                Validators.compose([Validators.required,
                ValidationService.checkConfirmPassword])],              
  	  userName : ['',Validators.compose([Validators.required,
  	                 Validators.maxLength(30),
  	                 Validators.pattern('[0-9a-zA-Z]*')])]
  	});

 
  }

  saveUser() {

    this.submitAttempt = true;
    this.loginCredentials = { email:this.newUserForm.controls.email.value,
                              password:this.newUserForm.controls.pword.value};
   
    // Validation checked and we write to database
    if ( this.newUserForm.valid) {
        console.log('form',this.newUserForm.controls);
        this.auth.signupEmail(this.newUserForm.controls).then(resp => {
          console.log('resp',resp);
          if (resp.hasOwnProperty('uid')) {
             this.navCtrl.setRoot(HomePage);
           } else {
             this.presentAlert(resp['message']);
           }
        });
    } else {
      //TODO:  Prompt screen of errors
      this.presentAlert("Fix the following erros to continue.");
    }
  }



  loginEmail(email,password) {

    let loginCredentials = {email:email,password:password,socialLogin:0};

    this.auth.login(loginCredentials).subscribe(allowed => {
      if (allowed) {
        setTimeout(() => {
        this.loading.dismiss();
        this.navCtrl.setRoot(HomePage)
        });
      }
    },
    error => {
      console.log(error);
    });    
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountFinalPage');
  }

  cancel() {
    this.view.dismiss();
  }

  presentLoading() {
	  this.loading = this.loadingCtrl.create({
	    content: 'Creating account. Please wait...'
	  });

	  this.loading.present();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }  

}
