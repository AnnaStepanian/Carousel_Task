import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CarouselConfig, CarouselConfigs} from "./carousel.configs";

@NgModule({
    declarations: [
        CarouselComponent
    ],
    exports: [
        CarouselComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
    ]
})
export class CarouselModule {
  static forRoot(config: CarouselConfig): ModuleWithProviders<CarouselModule> {
    return {
      ngModule: CarouselModule,
      providers: [
        {
          provide: CarouselConfigs,
          useValue: config,
        },
      ],
    };
  }
}

