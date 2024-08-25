import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import {  MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { TableService } from '../../services/table.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterOutlet,CommonModule,MatTableModule,MatPaginatorModule,MatSortModule,
    FormsModule,MatFormFieldModule,MatInputModule,
  ],
 
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  filterText = '';
  totalPages = 0;
  pageNumbers: number[] = [];
  isModalOpen: boolean = false;
  newEmployee: any = { lastName: '', firstName: '', age: null, salary: null };
  successMessage: string | null = null;
  sortColumn: string = ''; 
  sortDirection: 'asc' | 'desc' = 'asc'; 

  constructor(private employeeService: TableService , private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: any) => {
      const title = data.title || 'Titre par défaut';
      document.title = ` ${title}`;
    });

    this.getAllEmployees();
  }

  getAllEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
      console.log("data" ,this.employees)
      this.updateFilteredEmployees();
    });
  }

  deleteEmployee(index: number): void {
    const employeeToDelete = this.filteredEmployees[index];
    
    const confirmed = window.confirm('Are you sure you want to delete this employee?');
    
    if (confirmed) {
      this.employees = this.employees.filter(emp => emp !== employeeToDelete);
      
      this.updateFilteredEmployees();
    }
  }
  
  addEmployee(employee: any): void {
    this.employees.unshift(employee);
    this.updateFilteredEmployees();
  }

  updateFilteredEmployees(): void {
    const lowerCaseFilter = this.filterText.toLowerCase();
    
    this.filteredEmployees = this.employees
      .filter(emp =>
        emp.lastName.toLowerCase().includes(lowerCaseFilter) ||
        emp.firstName.toLowerCase().includes(lowerCaseFilter) ||
        (typeof emp.age === 'number' ? emp.age.toString().includes(lowerCaseFilter) : false)
      );
  
    if (this.sortColumn) {
      this.filteredEmployees.sort((a, b) => {
        const aVal = a[this.sortColumn];
        const bVal = b[this.sortColumn];
        if (aVal < bVal) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    
    this.filteredEmployees = this.filteredEmployees.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }
  
  applyFilter(event: any): void {
    this.filterText = event.target.value;
    this.updateFilteredEmployees();
  }

  updatePageNumbers(): void {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(increment: number): void {
    const newPage = this.currentPage + increment;
    if (newPage > 0 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updateFilteredEmployees();
    }
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredEmployees();
    }
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.updateFilteredEmployees();
  }

 

  //popup
  openAddEmployeeModal(): void {
    this.isModalOpen = true;
  }

  closeAddEmployeeModal(): void {
    this.isModalOpen = false;
  }

  submitAddEmployee(): void {
    if (this.newEmployee.lastName && this.newEmployee.firstName && this.newEmployee.age && this.newEmployee.salary) {
      this.addEmployee(this.newEmployee);
      this.successMessage = 'Employee added successfully!';
      this.newEmployee = { lastName: '', firstName: '', age: null, salary: null }; 
      
      this.sortColumn = ''; 
      this.sortDirection = 'asc'; 
      
      this.updateFilteredEmployees();
      
      setTimeout(() => {
        this.closeAddEmployeeModal();
      }, 2000);
    }
  }
  
}