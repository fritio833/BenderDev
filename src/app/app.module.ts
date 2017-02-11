import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { CreateAccountFinalPage } from '../pages/create-account-final/create-account-final';
import { SuccessPage } from '../pages/success/success';
import { ChooseCategoryPage } from '../pages/choose-category/choose-category';
import { ChooseBeerTypePage } from '../pages/choose-beer-type/choose-beer-type';
import { BeerListPage } from '../pages/beer-list/beer-list';
import { SwipePage } from '../pages/swipe/swipe';
import { SearchPage } from '../pages/search/search';
import { BreweryService } from '../providers/brewery-service';
import { BeerDetailPage } from '../pages/beer-detail/beer-detail';
import { MyPubPage } from '../pages/my-pub/my-pub';

<<<<<<< HEAD
import {FbProvider} from '../providers/fb-provider';
import { SingletonService } from '../providers/singleton';
import { ValidationService } from '../providers/validation-service';

=======
>>>>>>> parent of 7c48660... Facebook Login

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    CreateAccountPage,
    CreateAccountFinalPage,
    SuccessPage,
    ChooseCategoryPage,
    ChooseBeerTypePage,
    BeerListPage,
    BeerDetailPage,
    SwipePage,
    SearchPage,
    MyPubPage

  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    CreateAccountPage,
    CreateAccountFinalPage,
    SuccessPage,
    ChooseCategoryPage,
    ChooseBeerTypePage,
    BeerListPage,
    BeerDetailPage,
    SwipePage,
    SearchPage,
    MyPubPage
  ],
<<<<<<< HEAD
  providers: [{provide: ErrorHandler, 
              useClass: IonicErrorHandler},
              BreweryService,
              Storage,
              FbProvider,
              SingletonService,
              ValidationService]
=======
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},BreweryService,Storage]
>>>>>>> parent of 7c48660... Facebook Login
})
export class AppModule {}
