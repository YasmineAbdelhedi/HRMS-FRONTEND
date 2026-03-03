import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { ProjectService } from 'src/app/services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './project-dialog.component.html',
})
export class ProjectDialogComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    budget: [0],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
    if (data?.mode === 'edit' && data.project) {
      this.form.patchValue({
        name: data.project.name,
        description: data.project.description,
        budget: data.project.budget,
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.value as any;
    if (this.data?.mode === 'edit' && this.data.project) {
      this.projectService.updateProject(this.data.project.id, payload).subscribe({ next: () => { this.snackBar.open('Project updated', 'Close', { duration: 2000 }); this.dialogRef.close('saved'); }, error: e => { console.error(e); this.snackBar.open('Failed to update project', 'Close', { duration: 3000 }); } });
    } else {
      this.projectService.createProject(payload).subscribe({ next: () => { this.snackBar.open('Project created', 'Close', { duration: 2000 }); this.dialogRef.close('saved'); }, error: e => { console.error(e); this.snackBar.open('Failed to create project', 'Close', { duration: 3000 }); } });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
