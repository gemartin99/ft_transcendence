import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserI } from '../../../user/user.interface';
import { ChatService } from '../../chat.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent {

  form: FormGroup = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]+$/),
      Validators.maxLength(30)
    ]),
    password: new FormControl(null, [
      Validators.pattern(/^[a-zA-Z0-9]+$/),
      Validators.maxLength(30)
    ])
    // users: new FormArray([], [Validators.required])
  });

  constructor(
    private chatService: ChatService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<JoinRoomComponent>) { }

  join() {
    if (this.form.valid) {
      console.log("El formulario join room es valido");
      this.chatService.joinRoom(this.form.getRawValue());
      this.close();
      //this.router.navigate(['../../chat'], { relativeTo: this.activatedRoute });
    }
  }

  close(): void {
    this.dialogRef.close();
    const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
    if (overlayContainer) {
      overlayContainer.style.display = 'none';
    }
  }


  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get users(): FormArray {
     return this.form.get('users') as FormArray;
   }

}
