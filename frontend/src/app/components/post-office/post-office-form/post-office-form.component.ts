import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostOfficeService } from '../../../services/post-office.service';

@Component({
  selector: 'app-post-office-form',
  templateUrl: './post-office-form.component.html',
  styleUrls: ['./post-office-form.component.scss'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class PostOfficeFormComponent {
  public postOfficeForm: FormGroup;
  public submitted = false;
  public showSuccess = false;
  public errorMessage = '';
  public zipCode: string | null = null;
  public isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private postOfficeService: PostOfficeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.postOfficeForm = this.initializePostOfficeForm();
  }

  get f() {
    return this.postOfficeForm.controls;
  }

  public ngOnInit(): void {
    this.setEditForm();
  }

  public onSubmit() {
    this.submitted = true;

    if (this.postOfficeForm.invalid) {
      return;
    }
    const postOfficeData = this.postOfficeForm.value;

    if (this.isEditMode && this.zipCode) {
      this.postOfficeService
        .updatePostOffice(this.zipCode, postOfficeData)
        .subscribe(() => this.router.navigate(['/postOffices']));
    } else {
      this.createPostOffice(postOfficeData);
    }
  }

  public onReset() {
    this.submitted = false;
    this.postOfficeForm.reset();
  }

  private initializePostOfficeForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      address: ['', Validators.required],
    });
  }

  private createPostOffice(postOfficeData: any): void {
    this.postOfficeService.createPostOffice(postOfficeData).subscribe({
      next: () => {
        this.showSuccess = true;
        this.router.navigate(['/postOffices']);
        this.onReset();
      },
      error: (error) => {
        if (error.error && error.error.error) {
          this.postOfficeForm
            .get('zipCode')
            ?.setErrors({ backend: error.error.error });
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      },
      complete: () => {
        console.log('Post office creation process completed.');
      },
    });
  }

  private setEditForm(): void {
    this.zipCode = this.route.snapshot.paramMap?.get('zipCode');
    if (!this.zipCode) {
      return;
    }
    this.isEditMode = true;
    this.postOfficeService
      .getPostOfficeByZipCode(this.zipCode)
      .subscribe((postOffice) => {
        if (postOffice) {
          this.postOfficeForm.patchValue({
            name: postOffice.name,
            address: postOffice.address,
            zipCode: postOffice.zipCode,
          });
        }
      });
  }
}
