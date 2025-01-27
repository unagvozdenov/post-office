import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment, PaginatedResponse, ShipmentFilters } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private apiUrl = `${environment.apiUrl}/shipments`;

  constructor(private _http: HttpClient) {}

  public getShipments(
    filters: ShipmentFilters,
  ): Observable<PaginatedResponse<Shipment>> {
    let params = new HttpParams()
      .set('page', filters.page?.toString() || '1')
      .set('limit', filters.limit?.toString() || '10');

    params = this.setFilters(params, filters);

    return this._http.get<PaginatedResponse<Shipment>>(this.apiUrl, { params });
  }

  public getPackages(
    filters: ShipmentFilters,
  ): Observable<PaginatedResponse<Shipment>> {
    let params = new HttpParams()
      .set('page', filters.page?.toString() || '1')
      .set('limit', filters.limit?.toString() || '10');

    params = this.setFilters(params, filters);

    return this._http.get<PaginatedResponse<Shipment>>(
      `${this.apiUrl}/packages`,
      { params },
    );
  }

  public getShipmentByShipmentNumber(
    shipmentNumber: string,
  ): Observable<Shipment> {
    return this._http.get<Shipment>(`${this.apiUrl}/${shipmentNumber}`);
  }

  public createShipment(shipment: Shipment): Observable<Shipment> {
    return this._http.post<Shipment>(this.apiUrl, shipment);
  }

  public updateShipment(
    id: string,
    shipment: Partial<Shipment>,
  ): Observable<Shipment> {
    return this._http.put<Shipment>(`${this.apiUrl}/${id}`, shipment);
  }

  public deleteShipment(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private setFilters(params: HttpParams, filters: ShipmentFilters): HttpParams {
    const filterKeys: (keyof ShipmentFilters)[] = [
      'status',
      'type',
      'weightCategory',
      'originZipCode',
      'destinationZipCode',
      'shipmentNumber',
    ];

    filterKeys.forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return params;
  }
}
