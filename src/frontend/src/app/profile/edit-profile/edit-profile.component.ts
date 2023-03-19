import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth/auth.service';
import { User } from  '../../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  editForm: FormGroup;
  avatarFile: File;
  user: any;
  fileTypeError: boolean = false;
  nameInUseError: boolean = false;
  profileUpdated: boolean = false;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private authService: AuthService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.editForm = this.formBuilder.group({
      avatar: [''],
      name: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    });
    this.profileUpdated= false;
    await this.authService.refreshLoggedUser();
    this.user = await this.authService.getLoggedUser();
    this.editForm.get('name').setValue(this.user.name);
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const extension = event.target.files[0].name.split('.').pop().toLowerCase();
      if (extension !== 'jpg' && extension !== 'png') {
        this.fileTypeError = true;
        return;
      }
      this.fileTypeError = false;
      this.avatarFile = event.target.files[0];
    }
  }

  returnProfile()
  {
    this.router.navigate(['/profile']);
  }

  async updateUser(formData2: any) {
    this.nameInUseError = false;

    const isValidName = await this.apiService.userNameIsValid(this.editForm.get('name').value).toPromise();
    if(!isValidName)
    {
      this.nameInUseError = true;
      return;
    }
    
    if (!this.nameInUseError)
    {
      this.nameInUseError = false;
      if (this.avatarFile) {
          const formData = new FormData();
          formData.append('file', this.avatarFile);
          formData.append('id', this.user.id);
          await this.apiService.uploadAvatar(formData).subscribe((response) => {
        });
      } 
      if(!this.fileTypeError)
      {
        this.authService.refreshLoggedUser().then(async () => {
          this.user = await this.authService.getLoggedUser();
        });
        this.profileUpdated = true;
      }
    }
  }
}
