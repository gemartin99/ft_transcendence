import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { AuthService } from '../../auth/auth.service';
import { User } from  '../../user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  editForm: FormGroup;
  avatarFile: File;
  user: any;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      avatar: [''],
      twofactor: [false]
    });

    this.authService.loadLoggedUser().then(async () => {
      this.user = await this.authService.getLoggedUser();
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.avatarFile = event.target.files[0];
    }
  }

  updateUser(formData2: any) {
    console.log(formData2);
    if (this.avatarFile) {
      const formData = new FormData();
      formData.append('file', this.avatarFile);
      this.apiService.uploadAvatar(formData).subscribe((response) => {
          console.log('avatar uploaded');
      });
    } 
    this.apiService.updateTwofactor(formData2.twofactor).subscribe(() => {
      console.log('Two factor updated successfully');
    });
  }
}