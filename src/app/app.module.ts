import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { Ionic2RatingModule } from 'ionic2-rating';

import { FbProvider } from '../providers/fb-provider';
import { BreweryService } from '../providers/brewery-service';
import { SingletonService } from '../providers/singleton-service';
import { AuthService } from '../providers/auth-service';
import { DbService } from '../providers/db-service';
import { LocationService } from '../providers/location-service';
import { GoogleService } from '../providers/google-service';

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
import { BeerDetailPage } from '../pages/beer-detail/beer-detail';
import { MyPubPage } from '../pages/my-pub/my-pub';
import { LoginPage } from '../pages/login/login';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ProfilePage } from '../pages/profile/profile';
import { ReviewsPage } from '../pages/reviews/reviews';
import { FriendsPage } from '../pages/friends/friends';
import { ReviewBeerPage } from '../pages/review-beer/review-beer';
import { HomePage } from '../pages/home/home';
import { MyRatingsPage } from '../pages/my-ratings/my-ratings';
import { LocationResultsPage } from '../pages/location-results/location-results';
import { LocationDetailPage } from '../pages/location-detail/location-detail';
import { CheckinPage }  from '../pages/checkin/checkin';


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
    MyPubPage,
    LoginPage,
    FavoritesPage,
    ProfilePage,
    ReviewsPage,
    FriendsPage,
    ReviewBeerPage,
    HomePage,
    MyRatingsPage,
    LocationResultsPage,
    LocationDetailPage,
    CheckinPage

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule
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
    MyPubPage,
    LoginPage,
    FavoritesPage,
    ProfilePage,
    ReviewsPage,
    FriendsPage,
    ReviewBeerPage,
    HomePage,
    MyRatingsPage,
    LocationResultsPage,
    LocationDetailPage,
    CheckinPage
  ],
  providers: [{provide: ErrorHandler, 
              useClass: IonicErrorHandler},
              BreweryService,
              Storage,
              FbProvider,
              SingletonService,
              AuthService,
              DbService,
              LocationService,
              GoogleService]
})
export class AppModule {}
