import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";
import { User } from "../models/user";

@Injectable()
export class UserService {
    public url: string;
    public identity: string | null;
    public token: string | null;

    constructor(
        public _http: HttpClient
    ) {
        this.url = global.url;
        this.identity = null;
        this.token = null;
    }

    test() {
        return "Hola mundo desde un servicio";
    }

    register(user: User): Observable<any> {
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url+'register', params, {headers: headers});
    }

    login(user: User, gettoken: any = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = 'true';
        }

        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'login', params, {headers: headers});
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity')!);
    
        if (identity && identity != undefined) {
          this.identity = identity;
        }
        else {
            this.identity = null;
        }

        return this.identity;
    }

    getToken() {
        let token = localStorage.getItem('token');

        if (token && token != undefined) {
            this.token = token;
        }
        else {
            this.token = null;
        }
        return this.token;
    }

    getBlankUser(): User {
        return new User(1, '', '', 'ROLE_USER', '', '', '', '', '');
    }
}