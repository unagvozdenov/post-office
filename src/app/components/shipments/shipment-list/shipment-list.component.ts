import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ShipmentService } from '../../../services/shipment.service';
import { PostOfficeService } from '../../../services/post-office.service';
import {
  Shipment,
  ShipmentStatus,
  ShipmentType,
  WeightCategory,
  PostOffice,
} from '../../../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shipment-list',
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.scss'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class ShipmentListComponent implements OnInit {
  public filterForm: FormGroup;
  public dataToDisplay: Shipment[] = [];
  public postOffices: PostOffice[] = [];
  public currentPage: number = 1;
  public totalItems: number = 0;
  public pageSize: number = 3;
  public numberOfPages: number[] = [];

  public readonly shipmentStatuses = Object.values(ShipmentStatus);
  public readonly shipmentTypes = Object.values(ShipmentType);
  public readonly weightCategories = Object.values(WeightCategory);

  constructor(
    private shipmentService: ShipmentService,
    private postOfficeService: PostOfficeService,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.initializeFilterForm();
  }

  public ngOnInit(): void {
    this.loadPostOffices();
    this.loadShipments();
    this.setupFilterSubscription();
  }

  public onDeleteShipment(id: string): void {
    if (confirm('Are you sure you want to delete this shipment?')) {
      this.shipmentService
        .deleteShipment(id)
        .subscribe(() => this.loadShipments());
    }
  }

  public onPageChange(page: number): void {
    if (page < 1 || page > this.numberOfPages.length) {
      return;
    }
    this.currentPage = page;
    this.loadShipments();
  }

  public resetFilters(): void {
    this.filterForm.reset();
  }

  private loadPostOffices(): void {
    this.postOfficeService
      .getPostOffices()
      .subscribe((offices) => (this.postOffices = offices.data));
  }

  private loadShipments(): void {
    const filters = {
      ...this.filterForm.value,
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.shipmentService.getShipments(filters).subscribe((response) => {
      const data = response.data;
      this.totalItems = response.total;
      this.updatePagination();

      this.dataToDisplay = data.map((item, index) => ({
        ...item,
        index: (this.currentPage - 1) * this.pageSize + index + 1,
      }));
    });
  }

  private updatePagination(): void {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.numberOfPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  private initializeFilterForm(): FormGroup {
    return this.fb.group({
      status: [''],
      type: [''],
      weightCategory: [''],
      originZipCode: [''],
      destinationZipCode: [''],
      shipmentNumber: [''],
    });
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadShipments();
    });
  }
}
