import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PostOfficeFormComponent } from './post-office-form.component';
import { PostOfficeService } from '../../../services/post-office.service';
import { ActivatedRoute } from '@angular/router';

describe('PostOfficeFormComponent', () => {
  let component: PostOfficeFormComponent;
  let fixture: ComponentFixture<PostOfficeFormComponent>;
  let postOfficeServiceSpy: jasmine.SpyObj<PostOfficeService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    postOfficeServiceSpy = jasmine.createSpyObj('PostOfficeService', [
      'createPostOffice',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: {} },
    });

    await TestBed.configureTestingModule({
      imports: [PostOfficeFormComponent],
      providers: [
        { provide: PostOfficeService, useValue: postOfficeServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostOfficeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate zipCode correctly', () => {
    const zipCodeControl = component.postOfficeForm.controls['zipCode'];

    zipCodeControl.setValue('12345');
    expect(zipCodeControl.valid).toBeTrue();

    zipCodeControl.setValue('1234'); // Invalid, less than 5 digits
    expect(zipCodeControl.valid).toBeFalse();

    zipCodeControl.setValue('1234a'); // Invalid, contains letters
    expect(zipCodeControl.valid).toBeFalse();

    zipCodeControl.setValue(''); // Invalid, empty
    expect(zipCodeControl.valid).toBeFalse();
  });

  it('should submit the form if it is valid', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const mockResponse = {
      name: 'Test Post Office',
      zipCode: '12345',
      address: '123 Test Street',
    };

    postOfficeServiceSpy.createPostOffice.and.returnValue(of(mockResponse));

    component.postOfficeForm.controls['name'].setValue('Test Post Office');
    component.postOfficeForm.controls['zipCode'].setValue('12345');
    component.postOfficeForm.controls['address'].setValue('123 Test Street');

    component.postOfficeForm.updateValueAndValidity();
    expect(component.postOfficeForm.valid).toBeTrue();

    component.onSubmit();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(postOfficeServiceSpy.createPostOffice).toHaveBeenCalledWith({
      name: 'Test Post Office',
      zipCode: '12345',
      address: '123 Test Street',
    });
  });

  it('should not submit the form if it is not valid', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    component.postOfficeForm.controls['name'].setValue('Test Post Office');
    component.postOfficeForm.controls['zipCode'].setValue('12345678');
    component.postOfficeForm.controls['address'].setValue('123 Test Street');

    component.postOfficeForm.updateValueAndValidity();
    expect(component.postOfficeForm.valid).toBeFalse();

    component.onSubmit();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(postOfficeServiceSpy.createPostOffice).not.toHaveBeenCalled();
  });
});
