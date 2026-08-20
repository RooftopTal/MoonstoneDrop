import { effect, Injectable, signal } from '@angular/core';

const PHOTO_KEY = 'settings.boardPhoto';

@Injectable({ providedIn: 'root' })
export class BoardPhotoService {
  photoUrl = signal(this.load());
  image = signal<HTMLImageElement | null>(null);

  constructor() {
    effect(() => {
      const url = this.photoUrl();
      if (url) {
        localStorage.setItem(PHOTO_KEY, url);
      } else {
        localStorage.removeItem(PHOTO_KEY);
      }
    });

    this.loadImage(this.photoUrl());
  }

  setPhoto(dataUrl: string) {
    this.photoUrl.set(dataUrl);
    this.loadImage(dataUrl);
  }

  clearPhoto() {
    this.photoUrl.set(null);
    this.image.set(null);
  }

  private loadImage(url: string | null) {
    if (!url) {
      this.image.set(null);
      return;
    }

    const img = new Image();
    img.onload = () => this.image.set(img);
    img.src = url;
  }

  private load(): string | null {
    return localStorage.getItem(PHOTO_KEY);
  }
}
