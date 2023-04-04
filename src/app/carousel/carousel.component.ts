import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CarouselConfigs, CarouselConfig } from './carousel.configs';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit {
  @Input() items: string[] = [];
  @Input() visibleItemsCount: number;
  @Input() autoslide: boolean;
  @Input() loop: boolean;

  @Output() slideChanged = new EventEmitter<number>();
  @Output() mainImageChanged = new EventEmitter<string>();

  currentIndex: number = 0;
  lastIndex: number = 0;
  activeIndex = 0;
  showNextArrow: boolean = true;
  showPrevArrow: boolean = false;
  currentVisibleItems: string[] = [];
  noOfNeededItems: number = 0

  async runAutoslide() {
    const time = 3000;
    const sleep = () => new Promise((r) => setTimeout(r, time));
    if (this.loop) {
      while (true) {
        this.onNextClick();
        await sleep()
      }
    }
    let reachedAtEnd = false;
    await sleep()
    while (true) {
      if (this.currentIndex === this.items.length - this.visibleItemsCount - this.noOfNeededItems) {
        for (let i = 1; i < this.visibleItemsCount; i += 1) {
          this.activeIndex = i;
          this.mainImageChanged.emit(this.items[this.activeIndex + this.currentIndex]);
          await sleep()
        }
        reachedAtEnd = true;
      }

      if (reachedAtEnd) {
        break;
      }
      this.onNextClick();
      await sleep()
    }
  }

  constructor(@Inject(CarouselConfigs) private carouselConfig: CarouselConfig) {
    this.visibleItemsCount = carouselConfig.visibleItemsCount || 4;
    this.autoslide = carouselConfig.autoslide || false;
    this.loop = carouselConfig.loop || false;
  }

  ngOnInit(): void {
    this.showPrevArrow = this.loop;
    this.showNextArrow = this.items.length > this.visibleItemsCount;
    this.noOfNeededItems = this.visibleItemsCount - this.items.length % this.visibleItemsCount;
    this.items = [...this.items.slice(-this.noOfNeededItems), ...this.items, ...this.items.slice(0, this.visibleItemsCount)]
    this.currentIndex = this.noOfNeededItems;
    this.currentVisibleItems = this.items.slice(this.noOfNeededItems, this.noOfNeededItems + this.visibleItemsCount);
    if (this.autoslide) {
      this.runAutoslide();
    }
  }

  onMainImageClick(item: string, index: number): void {
    this.activeIndex = index;
    this.mainImageChanged.emit(item);
  }

  onNextClick(): void {
    this.currentIndex += 1;
    this.showPrevArrow = true;
    if (this.loop && this.currentIndex === this.items.length - this.visibleItemsCount) {
      this.currentIndex = this.noOfNeededItems;
    }
    if (!this.loop && this.currentIndex === this.items.length - this.visibleItemsCount - this.noOfNeededItems) {
      this.showNextArrow = false;
    }
    this.currentVisibleItems = this.items.slice(this.currentIndex, this.currentIndex + this.visibleItemsCount);
    this.mainImageChanged.emit(this.items[this.currentIndex + this.activeIndex]);
  }

  onPrevClick(): void {
    this.currentIndex -= 1;
    this.showNextArrow = true;
    if (this.loop && this.currentIndex === -1) {
      this.currentIndex = this.items.length - this.visibleItemsCount - this.noOfNeededItems;
    }
    if (!this.loop && this.currentIndex === this.noOfNeededItems) {
      this.showPrevArrow = false;
    }
    this.currentVisibleItems = this.items.slice(this.currentIndex, this.currentIndex + this.visibleItemsCount);
    this.mainImageChanged.emit(this.items[this.currentIndex + this.activeIndex]);
  }
}
