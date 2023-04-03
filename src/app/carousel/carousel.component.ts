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
    while (true) {
      if (this.currentIndex + this.visibleItemsCount >= this.items.length) {
        for (let i = 0; i < this.visibleItemsCount; i += 1) {
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
    this.currentVisibleItems = this.items.slice(0, this.visibleItemsCount);
    if (this.autoslide) {
      this.runAutoslide();
    }
  }

  onMainImageClick(item: string, index: number): void {
    this.activeIndex = index;
    this.mainImageChanged.emit(item);
  }

  handleLoopFromEnd() {
    this.currentVisibleItems = this.items.slice(this.currentIndex, this.currentIndex + this.visibleItemsCount);
    this.currentVisibleItems.push(...this.items.slice(0, (this.currentIndex + this.visibleItemsCount) - this.items.length))
    if (this.currentIndex + this.activeIndex >= this.items.length) {
      this.mainImageChanged.emit(this.items[this.currentIndex + this.activeIndex - this.items.length]);
    } else {
      this.mainImageChanged.emit(this.items[this.currentIndex + this.activeIndex]);
    }
  }

  handleLoopFromStart() {
    this.currentVisibleItems = this.items.slice(this.currentIndex);
    this.currentVisibleItems.push(...this.items.slice(0, this.visibleItemsCount + this.currentIndex))
    if (this.activeIndex < -this.currentIndex) {
      this.mainImageChanged.emit(this.items[this.items.length + this.currentIndex + this.activeIndex]);
    } else {
      this.mainImageChanged.emit(this.items[this.activeIndex + this.currentIndex]);
    }
  }

  onNextClick(): void {
    this.currentIndex += 1;
    this.showPrevArrow = true;
    if (this.currentIndex < 0) {
      this.handleLoopFromStart();
      return;
    }
    if (!this.loop && this.currentIndex + this.visibleItemsCount >= this.items.length) {
      this.showNextArrow = false;
    }
    if (this.loop && this.currentIndex + this.visibleItemsCount >= this.items.length) {
      this.handleLoopFromEnd();
      if (this.currentIndex === this.items.length - 1) {
        this.currentIndex = -1;
      }
      return;
    }
    this.currentVisibleItems = this.items.slice(this.currentIndex, this.currentIndex + this.visibleItemsCount);
    let currentActive = this.items[this.currentIndex + this.activeIndex];
    if (!currentActive) {
      currentActive = this.items[this.items.length - 1];
      this.activeIndex = (this.items.length - 1) % this.visibleItemsCount - 1;
    }
    this.mainImageChanged.emit(currentActive);
  }

  onPrevClick(): void {
    this.currentIndex -= 1;
    this.showNextArrow = true;
    if (!this.loop && this.currentIndex === 0) {
      this.showPrevArrow = false;
    }
    if (this.loop && this.currentIndex + this.visibleItemsCount >= this.items.length) {
      this.handleLoopFromEnd();
      if (this.currentIndex === this.items.length - this.visibleItemsCount) {
        this.currentIndex = -1;
      }
      return;
    }
    if (this.loop && this.currentIndex < 0 && this.currentIndex > -this.visibleItemsCount) {
      this.handleLoopFromStart();
      return;
    }
    if (this.loop && this.currentIndex < 0 && this.currentIndex === -this.visibleItemsCount) {
      this.currentIndex = this.items.length - this.visibleItemsCount;
    }
    this.currentVisibleItems = this.items.slice(this.currentIndex, this.currentIndex + this.visibleItemsCount);
    this.mainImageChanged.emit(this.items[this.currentIndex + this.activeIndex]);
  }
}
