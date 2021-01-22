import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBarConfig: MatSnackBarConfig = new MatSnackBarConfig()
  private snackBarAutoHide = 5000;
  constructor(private snackBar: MatSnackBar) { }

  createNotification(message:string): void{
    this.snackBarConfig.duration = this.snackBarAutoHide;
    this.snackBarConfig.horizontalPosition = 'center';
    this.snackBarConfig.verticalPosition = 'top';
    this.snackBar.open(message,'OK', this.snackBarConfig)
  }
}
