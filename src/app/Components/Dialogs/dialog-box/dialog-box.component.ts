import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BackendService } from '../../../services/backend.service';
import { ICbo } from '../../../models/cbo.model';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';

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
    MatNativeDateModule,
    MatSelectModule,
    NgFor,
    NgIf
  ],
})
export class DialogBoxComponent implements OnInit {
  horarioForm: FormGroup;
  cboTurnos: ICbo[] = [];
  turnSelect: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private backendService: BackendService
  ) {
    this.horarioForm = this.fb.group({
      i_hora_ccod: [{ value: data.i_hora_ccod, disabled: true }, Validators.required],
      i_sede_ccod: [data.i_sede_ccod, Validators.required],
      i_peri_ccod: [data.i_peri_ccod, Validators.required],
      i_hinicio: [data.i_hinicio, Validators.required],
      i_htermino: [data.i_htermino, Validators.required],
      i_turn_ccod: [data.i_turn_ccod, Validators.required],
      i_audi_tusuario: [data.i_audi_tusuario, Validators.required],
      i_origen: [data.i_origen, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getComboTurno();
  }

  getComboTurno(): void {
    this.backendService.getComboTurno().subscribe((data) => {
      console.log(data);
      this.cboTurnos = data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.horarioForm.value);
    console.log('Form validity:', this.horarioForm.valid);
    if (this.horarioForm.valid) {
      this.dialogRef.close(this.horarioForm.getRawValue());
    } else {
      console.error('Form invalid:', this.horarioForm.errors);
      for (const controlName in this.horarioForm.controls) {
        if (this.horarioForm.controls.hasOwnProperty(controlName)) {
          const control = this.horarioForm.get(controlName);
          console.log(
            `Control ${controlName}:`,
            control?.status,
            control?.value,
            control?.errors
          );
        }
      }
    }
  }
}
