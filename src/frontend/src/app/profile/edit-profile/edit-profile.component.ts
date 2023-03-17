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
  fileTypeError: boolean = false; // Add this variable

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      avatar: [''],
      twofactor: [false]
    });

    this.authService.refreshLoggedUser().then(async () => {
      this.user = await this.authService.getLoggedUser();
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const extension = event.target.files[0].name.split('.').pop().toLowerCase();
      if (extension !== 'jpg' && extension !== 'png') {
        this.fileTypeError = true; // Set fileTypeError to true if file type is incorrect
        return;
      }
      this.fileTypeError = false; // Set fileTypeError to false if file type is correct
      this.avatarFile = event.target.files[0];
    }
  }

  async updateUser(formData2: any) {
    // await this.apiService.updateTwofactor(formData2.twofactor).subscribe(() => {
    //   console.log('Two factor updated successfully');
    // });
    console.log(formData2);
    if (this.avatarFile) {
        const formData = new FormData();
        formData.append('file', this.avatarFile);
        formData.append('id', this.user.id);
        await this.apiService.uploadAvatar(formData).subscribe((response) => {
        console.log('avatar uploaded');
      });
    } 
    if(!this.fileTypeError)
    {
      this.authService.refreshLoggedUser().then(async () => {
        this.user = await this.authService.getLoggedUser();
      });
      this.router.navigate(['/profile']);
    }
  }
}