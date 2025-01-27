import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PostOfficeService } from '../../../services/post-office.service';
import { PostOffice } from '../../../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shipment-list',
  templateUrl: './post-office-list.component.html',
  styleUrls: ['./post-office-list.component.scss'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class PostOfficeListComponent implements OnInit {
  public filterForm: FormGroup;
  public dataToDisplay: PostOffice[] = [];
  public currentPage: number = 1;
  public totalItems: number = 0;
  public pageSize: number = 3;
  public numberOfPages: number[] = [];

  constructor(
    private postOfficeService: PostOfficeService,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.initializeFilterForm();
  }

  public ngOnInit(): void {
    this.loadPostOffices();
    this.setupFilterSubscription();
  }

  public onDeleteShipment(zipCode: string): void {
    if (confirm('Are you sure you want to delete this post office?')) {
      this.postOfficeService
        .deletePostOffice(zipCode)
        .subscribe(() => this.loadPostOffices());
    }
  }

  public onPageChange(page: number): void {
    if (page < 1 || page > this.numberOfPages.length) {
      return;
    }
    this.currentPage = page;
    this.loadPostOffices();
  }

  private loadPostOffices(): void {
    const filters = {
      ...this.filterForm.value,
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.postOfficeService.getPostOffices(filters).subscribe((response) => {
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
      zipCode: [''],
      name: [''],
    });
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.loadPostOffices();
    });
  }
}
