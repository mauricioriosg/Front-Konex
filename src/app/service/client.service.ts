import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Response } from "../models/utils/response.model";
import { Injectable } from "@angular/core";
import { locality } from "../models/locality.model";
import { Client } from "../models/client.model";
import { Dealer } from "../models/dealer.model";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private urlApi: string;

  constructor(private http: HttpClient) {
    this.urlApi = environment.urlApi;
  }

  getClients(params: object = {}): Observable<Response<Client>> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    const options = {
      headers,
      params: {
        perPage: "1",
        currentPage: "10",
        ...params,
      },
    };
    return this.http.get(`${this.urlApi}client/getClients`, options).pipe(
      map((resp: Response<Client>) => {
        return resp;
      })
    );
  }

  getLocalities(): Observable<Response<locality>> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    const options = {
      headers,
    };
    return this.http.get(`${this.urlApi}locality/getLocalities`, options).pipe(
      map((resp: Response<locality>) => {
        console.log("🚀 ~ ClientService ~ map ~ locality:", resp);
        return resp;
      })
    );
  }

  getDealerList(): Observable<Response<Dealer>> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    const options = {
      headers,
    };
    return this.http.get(`${this.urlApi}dealer/getDealerList`, options).pipe(
      map((resp: Response<Dealer>) => {
        console.log("🚀 ~ ClientService ~ map ~ Dealer:", resp);
        return resp;
      })
    );
  }

  postClient(client: Client): Observable<Response<Client>> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    const options = {
      headers,
    };
    return this.http.post(`${this.urlApi}client/save`, client, options).pipe(
      map((resp: Response<Client>) => {
        return resp;
      })
    );
  }

  putClient(client: Client): Observable<Response<Client>> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    const options = {
      headers,
    };
    return this.http.put(`${this.urlApi}client/update`, client, options).pipe(
      map((resp: Response<Client>) => {
        return resp;
      })
    );
  }

  deleteClient(client: Client): Observable<Response<Client>> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    const options = {
      headers,
    };
    return this.http.put(`${this.urlApi}client/delete`, client, options).pipe(
      map((resp: Response<Client>) => {
        return resp;
      })
    );
  }
}
