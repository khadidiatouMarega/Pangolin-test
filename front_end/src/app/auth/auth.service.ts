import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from "./User";

const jwt = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private uriseg = 'http://localhost:4242/api';
  currentUser = {};
  Name: any[]

  constructor(private http: HttpClient, public router: Router) { }

  // Gestion Inscription/Connexion et déconnexion
  public register(userData: any): Observable<any> {
    const URI = this.uriseg + '/register';
    return this.http.post(URI, userData);
  }

  public login(user: User) {
    const URI = this.uriseg + '/login';
    
    return this.http.post(URI, user, { responseType: 'text' })
      .subscribe((res: any) => {

        localStorage.setItem('auth-token', res)
        this.getUserProfile(res).subscribe((res) => {
          this.currentUser = res;
          this.router.navigate(['profil/' + res._id]);
        })
      })
  }

  logout() {
    if (localStorage.removeItem('auth-token') == null) {
      this.router.navigate(['/login']);
    }
  }

  getAccessToken() {
    return localStorage.getItem('auth-token');
  }

  isLoggedIn(): boolean {
    let authToken = localStorage.getItem('auth-token');
    return (authToken !== null) ? true : false;
  }

  addFriend(a) {
    const URI = this.uriseg + '/addFriend';

    return this.http.post(URI, a, { responseType: 'text' })
      .subscribe((res: any) => {
        this.currentUser = res;
      })
  }

  // Partie: Lister les utilisateurs, ajouter et supprimer des amis
  list(): Observable<User[]> {
    const URI = this.uriseg + '/users';
    return this.http.get(URI).pipe(
      map((res: any) => {
        return res.data || []
      })
    );
  }

  show(id: string): Observable<User> {
    const URI = this.uriseg + '/user/' + id;
    return this.http.get(URI).pipe(
      map((res: any) => {
        return res.data || []
      })
    );
  }

  friendShow(id): Observable<User[]> {
    const URI = this.uriseg + '/user/' + id;
    return this.http.get(URI).pipe(
      map((res: any) => {
        return res.data || []
      })
    );
  }

  showFriend(id: string): Observable<User[]> {
    const URI = this.uriseg + '/friend/' + id;
    return this.http.get(URI).pipe(
      map((res: any) => {
        var friend = res.data
        for (let i = 0; i < res.data.length; i++) {
          this.friendShow(friend[i]).subscribe((res: any) => {
            this.currentUser = res;
          })
          return res.data || []
        }
      })
    );
  }

  // Partie: modifier le profil
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

  goProfile() {
    let res = localStorage.getItem('auth-token')
    return this.getUserProfile(res).subscribe((res) => {
      this.currentUser = res;
      this.router.navigate(['profil/' + res._id]);
    })
  }

  public update(userData: any, id: string): Observable<any> {
    const URI = this.uriseg + '/user/' + id;
    return this.http.put(URI, userData);
  }
}