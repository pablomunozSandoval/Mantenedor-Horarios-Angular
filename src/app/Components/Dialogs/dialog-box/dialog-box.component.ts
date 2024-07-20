import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class DialogBoxComponent implements OnInit {
  horarioForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.horarioForm = this.fb.group({
      i_hora_ccod: [data.i_hora_ccod, Validators.required],
      i_sede_ccod: [data.i_sede_ccod, Validators.required],
      i_peri_ccod: [data.i_peri_ccod, Validators.required],
      i_hinicio: [new Date(data.i_hinicio), Validators.required],
      i_htermino: [new Date(data.i_htermino), Validators.required],
      i_turn_ccod: [data.i_turn_ccod, Validators.required],
      i_audi_tusuario: [data.i_audi_tusuario, Validators.required],
      i_origen: [data.i_origen, Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Initial data:', this.data);

    // Ensure form controls are set with correct values
    this.horarioForm.get('i_hinicio')?.setValue(this.data.i_hinicio);
    this.horarioForm.get('i_htermino')?.setValue(this.data.i_htermino);

    this.horarioForm.get('i_audi_tusuario')?.setValue(this.data.i_audi_tusuario);
    this.horarioForm.get('i_origen')?.setValue(this.data.i_origen);
    this.horarioForm.get('i_hora_ccod')?.setValue(this.data.i_hora_ccod);
    this.horarioForm.get('i_turn_ccod')?.setValue(this.data.i_turn_ccod);
    
    this.horarioForm.get('i_sede_ccod')?.setValue(this.data.i_sede_ccod);
    this.horarioForm.get('i_peri_ccod')?.setValue(this.data.i_peri_ccod);


    console.log('Form status:', this.horarioForm.status);
    console.log('Form value:', this.horarioForm.value);
    console.log('Form errors:', this.horarioForm.errors);


    // Log each control status and value
    for (const controlName in this.horarioForm.controls) {
      if (this.horarioForm.controls.hasOwnProperty(controlName)) {
        const control = this.horarioForm.get(controlName);
        console.log(`Control ${controlName}:`, control?.status, control?.value, control?.errors);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log('Form validity:', this.horarioForm.valid);
    if (this.horarioForm.valid) {
      this.dialogRef.close(this.horarioForm.value);
    } else {
      console.error('Form invalid:', this.horarioForm.errors);
      for (const controlName in this.horarioForm.controls) {
        if (this.horarioForm.controls.hasOwnProperty(controlName)) {
          const control = this.horarioForm.get(controlName);
          console.log(`Control ${controlName}:`, control?.status, control?.value, control?.errors);
        }
      }
    }
  }
}
