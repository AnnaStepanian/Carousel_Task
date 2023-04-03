import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  imagesLinks: string[] = [
    '/assets/images/01.jpg',
    '/assets/images/02.jpg',
    '/assets/images/03.jpg',
    '/assets/images/04.jpg',
    '/assets/images/05.jpg',
    '/assets/images/06.jpg',
    '/assets/images/07.jpg',
    '/assets/images/08.jpg',
    '/assets/images/09.jpg',
    '/assets/images/10.jpg',
    '/assets/images/11.jpg',
    '/assets/images/12.jpg',
    '/assets/images/13.jpg',
    '/assets/images/14.jpg'
  ]

  currentImagesLink: string = this.imagesLinks[0];

  constructor() { }

  onMainImageChanged(imageLink: string) {
    this.currentImagesLink = imageLink;
  }
  onSlideChanged(newSlideIndex: number): void {
    // console.log('Slide changed to index:', newSlideIndex);
  }

}
