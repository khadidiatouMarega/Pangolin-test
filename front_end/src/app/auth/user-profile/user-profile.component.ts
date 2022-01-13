import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, Router } from "@angular/router";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {

  private uriseg = 'http://localhost:4242/api';
  currentUser = {};
  namee: any[]
  agee: any[]
  famillee: any[]
  formData: any = {};
  errors: any = [];
  id: any[]
  Id: any[]
  length : any
  mess : any
  Name: any
  users : any[]
  nameList: Array<{name: string}> = []; 


  constructor(private http: HttpClient, private userService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }
  
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id

    this.userService.show(id).subscribe((res: any) => {
      this.agee = res.age
      this.namee = res.name
      this.famillee = res.famille
    })

    this.userService.showFriend(id).subscribe((res: any) => {
      var length = res.length
      this.length = res.length
      const friend = res
      for (let i = 0; i < length; i++) {
        this.userService.friendShow(friend[i]).subscribe((res: any) => {
          this.users = res 
          this.Id = res._id
          this.Name = res.name
          this.nameList.push({name: this.Name})
        })  
      }
    })
  }
  
  taille(){
    var taille = this.length
    if (taille == undefined) {
      this.mess = "Pas d'amis 😢"
      return this.mess
    }
  }

  deleteFriend(friend) {
    const URI = this.uriseg + '/deleteFriend';
    friend = this.Id
    let id = localStorage.getItem('auth-token')
    return this.userService.getUserProfile(id).subscribe((res) => {
      var sup = { requester: res._id,
                  recipient: friend
                }

      return this.http.post(URI, sup, {responseType: 'text'}).subscribe((res: any) => {
        this.currentUser = res;
        alert('Ami(e) supprimé !')
        location.reload()
      })
    })  
  }

  
  update(): void {
    const id = this.activatedRoute.snapshot.params.id
    this.errors = [];
    this.userService.update(this.formData, id)
      .subscribe(() => {
        alert('Modification du profil')
        location.reload()
      },
      (errorResponse) => {          
        this.errors.push(errorResponse.error.error);
      });
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
        return res || []
      })
    );
  }

  addNewFriend(): void {
      this.userService.register(this.formData).subscribe((res) => {
        console.log(res.user,"test");

        let b = res.user

        let id = localStorage.getItem('auth-token')
        return this.getUserProfile(id).subscribe((res) => {
          this.currentUser = res;
          var add = {
            requester: res._id,
            recipient: b
          }
          this.userService.addFriend(add)
          alert('Ami(e) ajouté !')
        })
      })    
  }

}
