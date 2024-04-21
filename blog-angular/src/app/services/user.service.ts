import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { global } from "./global";
import { User } from "../models/user";

@Injectable()
export class UserService {
    public url: string;
    public identity: any;
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

    login(user: any, gettoken: any = null): Observable<any> {
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
        return new User(1, '', '', 'ROLE_USER', '', '', '', '');
    }

    update(token: string, user: User): Observable<any> {
        user.description = global.htmlEntities(user.description);
        let json = JSON.stringify(user);
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', token);

        return this._http.put(this.url + 'user/update', params, {headers: headers});
    }

    uploadUserImage(file: File, token: string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        const formData = new FormData();

        formData.append("file0", file, file.name);
        console.log("Filename: " + file.name);

        return this._http.post(this.url + "user/upload", formData, {headers: headers});
    }
}