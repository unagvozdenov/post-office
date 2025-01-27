import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse, PostOffice, PostOfficeFilters } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostOfficeService {
  private apiUrl = `${environment.apiUrl}/post-offices`;

  constructor(private _http: HttpClient) {}

  public getPostOffices(
    filters?: PostOfficeFilters,
  ): Observable<PaginatedResponse<PostOffice>> {
    let params = new HttpParams()
      .set('page', filters?.page?.toString() || '1')
      .set('limit', filters?.limit?.toString() || '10');
    if (filters) {
      params = this.setFilters(params, filters);
    }
    return this._http.get<PaginatedResponse<PostOffice>>(this.apiUrl, {
      params,
    });
  }

  public getPostOfficeByZipCode(zipCode: string): Observable<PostOffice> {
    return this._http.get<PostOffice>(`${this.apiUrl}/${zipCode}`);
  }

  public createPostOffice(postOffice: PostOffice): Observable<PostOffice> {
    return this._http.post<PostOffice>(this.apiUrl, postOffice);
  }

  public deletePostOffice(zipCode: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${zipCode}`);
  }

  public updatePostOffice(
    id: string,
    postOffice: Partial<PostOffice>,
  ): Observable<PostOffice> {
    return this._http.put<PostOffice>(`${this.apiUrl}/${id}`, postOffice);
  }

  private setFilters(
    params: HttpParams,
    filters: PostOfficeFilters,
  ): HttpParams {
    const filterKeys: (keyof PostOfficeFilters)[] = ['name', 'zipCode'];

    filterKeys.forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return params;
  }
}
