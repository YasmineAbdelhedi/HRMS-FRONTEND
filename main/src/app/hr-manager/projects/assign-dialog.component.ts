import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectAssignment, ProjectAssignmentDto } from 'src/app/models/projectassignment.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hr-assign-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './assign-dialog.component.html'
})
export class HRAssignDialogComponent {
  employees: any[] = [];
  selected: number[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private projectService: ProjectService, private snackBar: MatSnackBar, private dialogRef: MatDialogRef<HRAssignDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userService.getAllUsers().subscribe({ next: u => { this.employees = u || []; }, error: e => console.error(e) });
  }

  toggle(id: number) { const idx = this.selected.indexOf(id); if (idx > -1) this.selected.splice(idx, 1); else this.selected.push(id); }

  assign() {
    const assignments: ProjectAssignmentDto[] = this.selected.map(id => ({ userId: id, role: 'EMPLOYEE' }));
    this.projectService.assignEmployeesToProject(this.data.project.id, assignments).subscribe({ next: () => { this.snackBar.open('Assigned', 'Close', { duration: 2000 }); this.dialogRef.close('assigned'); }, error: e => { console.error(e); this.snackBar.open('Failed to assign', 'Close', { duration: 3000 }); } });
  }

  cancel() { this.dialogRef.close(); }
}
