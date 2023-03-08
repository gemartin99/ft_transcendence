import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserI } from '../../../user/user.interface';
import { ChatService } from '../../chat.service';


@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {

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

  constructor(private chatService: ChatService, private router: Router, private activatedRoute: ActivatedRoute) { }

  create() {
    if (this.form.valid) {
      console.log("El formulario create room es valido");
      this.chatService.createRoom(this.form.getRawValue());
      this.router.navigate(['../../chat'], { relativeTo: this.activatedRoute });
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
