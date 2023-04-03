import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CarouselModule} from "./carousel/carousel.module";
import {NgOptimizedImage} from "@angular/common";
import {CarouselConfigs} from "./carousel/carousel.configs";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CarouselModule,
        NgOptimizedImage,
    ],
  providers: [
    {
      provide: CarouselConfigs,
      useValue: {
        visibleItemsCount: 4,
        autoslide: false,
        loop: false,
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { };
