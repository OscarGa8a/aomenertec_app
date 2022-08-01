import { AbstractControl, FormControl } from '@angular/forms';

export const toFormControl = (abstractControl: AbstractControl): FormControl => abstractControl as FormControl;

