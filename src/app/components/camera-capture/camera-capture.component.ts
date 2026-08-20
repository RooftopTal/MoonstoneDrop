import { AfterViewInit, Component, computed, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { BoardPhotoService } from '../../services/board-photo.service';

@Component({
  selector: 'app-camera-capture',
  imports: [MatIconModule, MatButtonModule, MatSliderModule],
  templateUrl: './camera-capture.component.html',
  styleUrl: './camera-capture.component.css',
})
export class CameraCaptureComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private boardPhoto = inject(BoardPhotoService);

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('frame') frameRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  static readonly outputSize = 512;

  error = signal<string | null>(null);
  private stream?: MediaStream;

  pickedImage = signal<HTMLImageElement | null>(null);
  zoom = signal(1);
  pan = signal({ x: 0, y: 0 });

  private dragStart: { x: number; y: number; panX: number; panY: number } | null = null;

  imgWidthPercent = computed(() => {
    const img = this.pickedImage();
    if (!img) return 100;
    const portraitOrSquare = img.naturalWidth <= img.naturalHeight;
    const base = portraitOrSquare ? 100 : (100 * img.naturalWidth) / img.naturalHeight;
    return base * this.zoom();
  });

  imgHeightPercent = computed(() => {
    const img = this.pickedImage();
    if (!img) return 100;
    const portraitOrSquare = img.naturalWidth <= img.naturalHeight;
    const base = portraitOrSquare ? (100 * img.naturalHeight) / img.naturalWidth : 100;
    return base * this.zoom();
  });

  async ngAfterViewInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      this.videoRef.nativeElement.srcObject = this.stream;
    } catch {
      this.error.set('Could not access the camera. Check permissions and try again.');
    }
  }

  private pickedImageUrl?: string;

  ngOnDestroy() {
    this.stream?.getTracks().forEach((track) => track.stop());
    if (this.pickedImageUrl) URL.revokeObjectURL(this.pickedImageUrl);
  }

  choosePhoto() {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.stream?.getTracks().forEach((track) => track.stop());
    if (this.pickedImageUrl) URL.revokeObjectURL(this.pickedImageUrl);

    const url = URL.createObjectURL(file);
    this.pickedImageUrl = url;

    const img = new Image();
    img.onload = () => {
      this.pickedImage.set(img);
      this.zoom.set(1);
      this.pan.set({ x: 0, y: 0 });
    };
    img.src = url;
  }

  onZoomChange(zoom: number) {
    this.zoom.set(zoom);
    this.clampPan();
  }

  onPointerDown(event: PointerEvent) {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    this.dragStart = { x: event.clientX, y: event.clientY, panX: this.pan().x, panY: this.pan().y };
  }

  onPointerMove(event: PointerEvent) {
    if (!this.dragStart) return;

    const frameSize = this.frameRef.nativeElement.clientWidth;
    const dxPercent = ((event.clientX - this.dragStart.x) / frameSize) * 100;
    const dyPercent = ((event.clientY - this.dragStart.y) / frameSize) * 100;

    this.pan.set({ x: this.dragStart.panX + dxPercent, y: this.dragStart.panY + dyPercent });
    this.clampPan();
  }

  onPointerUp() {
    this.dragStart = null;
  }

  private clampPan() {
    const maxX = Math.max(0, (this.imgWidthPercent() - 100) / 2);
    const maxY = Math.max(0, (this.imgHeightPercent() - 100) / 2);
    const current = this.pan();

    this.pan.set({
      x: Math.min(maxX, Math.max(-maxX, current.x)),
      y: Math.min(maxY, Math.max(-maxY, current.y)),
    });
  }

  capture() {
    const video = this.videoRef.nativeElement;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = CameraCaptureComponent.outputSize;
    canvas.height = CameraCaptureComponent.outputSize;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, canvas.width, canvas.height);

    this.boardPhoto.setPhoto(canvas.toDataURL('image/jpeg', 0.85));
    this.router.navigate(['/drop']);
  }

  confirmFilePhoto() {
    const img = this.pickedImage();
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = CameraCaptureComponent.outputSize;
    canvas.height = CameraCaptureComponent.outputSize;

    const widthPx = (this.imgWidthPercent() / 100) * canvas.width;
    const heightPx = (this.imgHeightPercent() / 100) * canvas.height;
    const centerX = canvas.width / 2 + (this.pan().x / 100) * canvas.width;
    const centerY = canvas.height / 2 + (this.pan().y / 100) * canvas.height;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, centerX - widthPx / 2, centerY - heightPx / 2, widthPx, heightPx);

    this.boardPhoto.setPhoto(canvas.toDataURL('image/jpeg', 0.85));
    this.router.navigate(['/drop']);
  }

  cancel() {
    this.router.navigate(['/drop']);
  }
}
