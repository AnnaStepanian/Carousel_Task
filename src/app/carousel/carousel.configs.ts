import { InjectionToken } from '@angular/core';

export const CarouselConfigs = new InjectionToken<CarouselConfig>('CarouselConfigs');

export interface CarouselConfig {
  visibleItemsCount?: number;
  autoslide?: boolean;
  loop?: boolean;
}
