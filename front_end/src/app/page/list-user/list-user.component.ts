import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  providers: [AuthService]
})
export class ListUserComponent implements OnInit {
  users: any
  addFriendForm: FormGroup;
  private uriseg = 'http://localhost:4242/api';
  currentUser = {};

  constructor(private userService: AuthService, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.userService.list().subscribe((res: any) => {
      this.users = res
    })
  }

  getUserProfile(id): Observable<any> {
    const URI = this.uriseg + '/user/';
    const URITOKEN = this.uriseg + '/post'
    return this.http.get(URITOKEN, {
      headers: new HttpHeaders({
        'auth-token': id
      })
    }).pipe(
      map((res: any) => {
        // console.log(res,'testtoken');
        return res || []
      })
    );
  }

  addFriend(b) {
    let id = localStorage.getItem('auth-token')
    return this.getUserProfile(id).subscribe((res) => {
      // console.log(res._id,'teeeeeest');
      this.currentUser = res;
      var add = {
        requester: res._id,
        recipient: b
      }
      this.userService.addFriend(add)
      alert('Ami(e) ajouté !')
      // console.log(add,'teeest');
    })

  }
}
