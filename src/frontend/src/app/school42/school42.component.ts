import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-school42',
  templateUrl: './school42.component.html',
  styleUrls: ['./school42.component.css']
})
export class School42Component implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      console.log(params);
    });

    // let code = this.route.snapshot.queryParams['code'];
    // let error = this.route.snapshot.queryParams['error'];
    // let error_description = this.route.snapshot.queryParams['error_description'];

    // if (code) {
    //   console.log('Access code:', code);



    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     })
    //   };

    //   const body = new HttpParams()
    //     .set('grant_type', 'authorization_code')
    //     .set('client_id', 'u-s4t2ud-0a3a4869eb0242ff32bdffe102dc9021ccbba3501e7da809f76c877b404a84ba')
    //     .set('client_secret', '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')
    //     .set('code', code)
    //     .set('redirect_uri', 'https://crazy-pong.com/school42/callback');

    //   this.http.post('https://api.intra.42.fr/oauth/token', body, httpOptions)
    //     .subscribe(data => {
    //       console.log(data);
    //   });


    // } else {
    //   console.error('Access code not found');
    // }

    // if (code) {
    //   //this.makeApiRequest(code);
    // } else if (error) {
    //   console.error(`Error: ${error} - ${error_description}`);
    // } else {
    //   console.error('Error: No parameters were sent');
    // }
  }

}



// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Component({
//   selector: 'app-school42',
//   templateUrl: './school42.component.html',
//   styleUrls: ['./school42.component.css']
// })
// export class School42Component implements OnInit {
//   constructor(private route: ActivatedRoute, private http: HttpClient) {}

//   ngOnInit(): void {
//     let code = this.route.snapshot.queryParams['code'];
//     let error = this.route.snapshot.queryParams['error'];
//     let error_description = this.route.snapshot.queryParams['error_description'];

//     if (code) {
//       console.log('Access code:', code);
//     } else {
//       console.error('Access code not found');
//     }

//     if (code) {
//       this.makeApiRequest(code);
//     } else if (error) {
//       console.error(`Error: ${error} - ${error_description}`);
//     } else {
//       console.error('Error: No parameters were sent');
//     }
//   }

//   makeApiRequest(token: string) {

//   //   let requestOptions: RequestInit = {
//   //     method: 'GET',
//   //     headers: new Headers({Authorization: `Bearer ${token}`}),
//   //     redirect: 'follow',
//   //     mode: 'no-cors'
//   //   };

//   //   fetch("https://api.intra.42.fr/v2/me", requestOptions)
//   //     .then(response => {
//   //       if (!response.ok) {
//   //         throw new Error(response.statusText);
//   //       }
//   //       return response.json();
//   //     })
//   //     .then(data => console.log(data))
//   //     .catch(error => console.error('error', error));
//   // }

//   const httpOptions = {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/x-www-form-urlencoded'
//     })
//   };


//   const body = new HttpParams()
//     .set('grant_type', 'authorization_code')
//     .set('client_id', 'u-s4t2ud-0a3a4869eb0242ff32bdffe102dc9021ccbba3501e7da809f76c877b404a84ba')
//     .set('client_secret', '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')
//     .set('code', token)
//     .set('redirect_uri', 'https://crazy-pong.com/school42/callback');

//   this.http.post('https://api.intra.42.fr/oauth/token', body, httpOptions)
//     .subscribe(data => {
//       console.log(data);
//   });
// }


