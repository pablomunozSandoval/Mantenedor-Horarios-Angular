import { Component, Inject } from '@angular/core';
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
export class DialogBoxComponent {
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.horarioForm.valid) {
      this.dialogRef.close(this.horarioForm.value);
    }
  }
}
