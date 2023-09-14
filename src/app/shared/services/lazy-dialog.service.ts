import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class LazyDialogService {
  constructor(private dialog: MatDialog) {}

  async openDialog(dialogName: string, config: any): Promise<MatDialogRef<any>> {
    const chunk = await import(
      `../../modals/${dialogName}/${dialogName}.component`
    );

    const dialogComponent = Object.values(chunk)[0] as ComponentType<unknown>;
    return this.dialog.open(dialogComponent, config);
  }
}