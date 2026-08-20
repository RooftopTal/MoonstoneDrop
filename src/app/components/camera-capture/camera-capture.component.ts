import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BoardPhotoService } from '../../services/board-photo.service';

@Component({
  selector: 'app-camera-capture',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './camera-capture.component.html',
  styleUrl: './camera-capture.component.css',
})
export class CameraCaptureComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private boardPhoto = inject(BoardPhotoService);

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  static readonly outputSize = 512;

  error = signal<string | null>(null);
  private stream?: MediaStream;

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

  ngOnDestroy() {
    this.stream?.getTracks().forEach((track) => track.stop());
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

  cancel() {
    this.router.navigate(['/drop']);
  }
}
