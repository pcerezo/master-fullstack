import { Injectable } from "@angular/core";
import { global } from "./global";
import { HttpClient, HttpHeaderResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../models/category";
import { Post } from "../models/post";

@Injectable()
export class PostService {
    public url: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = global.url;
    }

    uploadPostImage(file: File, token: string): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', token);
        const formData = new FormData();

        formData.append("file0", file, file.name);
        console.log("Filename: " + file.name);

        return this._http.post(this.url + "post/upload", formData, {headers: headers});
    }

    create(token: string, post: Post): Observable<any> {
        if (post.image == "") {
            post.image = null;
        }
        // se limpia el contenido del texto enriquecido
        post.content = global.htmlEntities(post.content);
        let json = JSON.stringify(post);
        let params = "json="+json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', token);

        return this._http.post(this.url + 'post', params, {headers: headers});
    }

    getPosts(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.get(this.url + "post", {headers: headers});
    }

    getPost(id: number): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.get(this.url + "post/" + id, {headers: headers});
    }

    getBlankPost(): Post {
        return new Post(0, 0, 0, '', '', null);
    }

    update(token: string, post: Post, id: number): Observable<any> {
        if (post.image == "") {
            post.image = null;
        }
        // se limpia el contenido del texto enriquecido
        post.content = global.htmlEntities(post.content);
        let json = JSON.stringify(post);
        let params = "json="+json;

        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);

        return this._http.put(this.url + "post/" + id, params, {headers: headers});
    }

    delete(token: string, id: number): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);

        return this._http.delete(this.url + "post/" + id, {headers: headers});
    }
}