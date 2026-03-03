import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from 'src/app/material.module';
import { ProjectService } from 'src/app/services/project.service';
import { Project, ProjectDto } from 'src/app/models/project.model';
import { ProjectDialogComponent } from 'src/app/admin/projects/project-dialog.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  dataSource = new MatTableDataSource<ProjectDto>([]);
  displayedColumns: string[] = ['name', 'description', 'projectManager', 'budget', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.dataSource.data = data || [];
        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.snackBar.open('Failed to load projects', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreate() {
    const ref = this.dialog.open(ProjectDialogComponent, { data: { mode: 'create' }, width: '600px' });
    ref.afterClosed().subscribe(res => { if (res === 'saved') this.loadProjects(); });
  }

  openEdit(project: ProjectDto) {
    const ref = this.dialog.open(ProjectDialogComponent, { data: { mode: 'edit', project }, width: '600px' });
    ref.afterClosed().subscribe(res => { if (res === 'saved') this.loadProjects(); });
  }

  deleteProject(p: ProjectDto) {
    if (!confirm(`Delete project ${p.name}?`)) return;
    this.projectService.deleteProject(p.id).subscribe({ next: () => { this.snackBar.open('Project deleted', 'Close', { duration: 2000 }); this.loadProjects(); }, error: e => { console.error(e); this.snackBar.open('Failed to delete project', 'Close', { duration: 3000 }); } });
  }
}
