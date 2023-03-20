import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { User } from '../../user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-options',
  templateUrl: './game-options.component.html',
  styleUrls: ['./game-options.component.css']
})
export class GameOptionsComponent implements OnInit {

  selectedOption: number;

  constructor(private apiService: ApiService,  private router: Router) { }

  ngOnInit() {
  }

  saveGameOption(): void {
    this.apiService.setGameOption(this.selectedOption).subscribe(user => {
      if(user)
        console.log('Option updated');
        this.router.navigate(['profile']);
    });
  }

}
