import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShipmentService } from '../../../services/shipment.service';
import { PostOfficeService } from '../../../services/post-office.service';
import {
  ShipmentStatus,
  ShipmentType,
  WeightCategory,
  PostOffice,
} from '../../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipment-form',
  templateUrl: './shipment-form.component.html',
  styleUrls: ['./shipment-form.component.scss'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class ShipmentFormComponent implements OnInit {
  public shipmentForm: FormGroup;
  public isEditMode = false;
  public shipmentNumber: string | null = null;
  public postOffices: PostOffice[] = [];

  public readonly shipmentTypes = Object.values(ShipmentType);
  public readonly shipmentStatuses = Object.values(ShipmentStatus);
  public readonly weightCategories = Object.values(WeightCategory);

  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService,
    private postOfficeService: PostOfficeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.shipmentForm = this.initializeShipmentForm();
  }

  public ngOnInit(): void {
    this.loadPostOffices();

    this.shipmentNumber = this.route.snapshot.paramMap.get('shipmentNumber');
    this.setEditForm();
  }

  public onSubmit(): void {
    if (this.shipmentForm.valid) {
      const shipmentData = this.shipmentForm.value;

      if (this.isEditMode && this.shipmentNumber) {
        this.shipmentService
          .updateShipment(this.shipmentNumber, shipmentData)
          .subscribe(() => this.router.navigate(['/shipments']));
      } else {
        delete shipmentData.shipmentNumber;
        this.shipmentService
          .createShipment(shipmentData)
          .subscribe(() => this.router.navigate(['/shipments']));
      }
    }
  }

  private loadPostOffices(): void {
    this.postOfficeService.getPostOffices().subscribe((offices) => {
      this.postOffices = offices.data;
    });
  }

  private initializeShipmentForm(): FormGroup {
    return this.fb.group({
      shipmentNumber: [undefined],
      type: ['', Validators.required],
      status: [ShipmentStatus.RECEIVED_ORIGIN],
      actualWeight: ['', Validators.required],
      originZipCode: ['', Validators.required],
      destinationZipCode: ['', Validators.required],
    });
  }

  private setEditForm(): void {
    if (!this.shipmentNumber) {
      return;
    }
    this.isEditMode = true;
    this.shipmentService
      .getShipmentByShipmentNumber(this.shipmentNumber)
      .subscribe((shipment) => {
        if (shipment) {
          this.shipmentForm.patchValue({
            type: shipment.type,
            status: shipment.status,
            weightCategory: shipment.weightCategory,
            actualWeight: shipment.actualWeight,
            originZipCode: shipment.originZipCode,
            destinationZipCode: shipment.destinationZipCode,
            shipmentNumber: shipment.shipmentNumber,
          });
        }
      });
  }
}
