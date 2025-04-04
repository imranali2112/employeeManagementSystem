import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Employee } from './model/employee'; // Ensure the correct path

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  employeeForm: FormGroup;
  employeeList: Employee[] = [];
  selectedEmployee: Employee | null = null;

  constructor() {
    this.employeeForm = new FormGroup({});
    this.loadEmployees();
    this.createForm();
  }

  loadEmployees(): void {
    this.employeeList = JSON.parse(localStorage.getItem('employees') || '[]');
  }

  getEmployees(): Employee[] {
    return this.employeeList;
  }

  createForm(): void {
    this.employeeForm = new FormGroup({
      empId: new FormControl(null), 
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(4), Validators.pattern('^[A-Za-z ]+$')]
      }),
      city: new FormControl('', {
        validators: [Validators.required, Validators.pattern('^[A-Za-z ]+$')]
      }),
      
      state: new FormControl('', {
       validators: [Validators.required, Validators.pattern('^[A-Za-z ]+$')]
      }), 
      contactNo: new FormControl('',
         [Validators.required, Validators.pattern('^[0-9]{11}$')]
      ),
      address: new FormControl('',{
        validators: [Validators.required, Validators.minLength(10)]
      }),
      pinCode: new FormControl('',{
        validators:[Validators.required, Validators.pattern('^[0-9]{6}')]
      })
    });
  }

  onSave(): void {
    if (this.employeeForm.valid) {
      let employees: Employee[] = JSON.parse(localStorage.getItem('employees') || '[]');

      // Ensure empId is unique and always a number
      const newEmpId = employees.length > 0 ? Math.max(...employees.map(emp => emp.empId ?? 0)) + 1 : 1;
      this.employeeForm.controls['empId'].setValue(newEmpId);

      employees.push(this.employeeForm.value as Employee);
      localStorage.setItem('employees', JSON.stringify(employees));
      this.loadEmployees();
      this.createForm();
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  onEdit(employee: Employee): void {
    this.selectedEmployee = employee;
    this.employeeForm.patchValue(employee);
  }

  onUpdate(): void {
    if (this.employeeForm.valid && this.selectedEmployee) {
      let employees: Employee[] = JSON.parse(localStorage.getItem('employees') || '[]');
      let index = employees.findIndex(emp => emp.empId === (this.selectedEmployee?.empId ?? 0));

      if (index !== -1) {
        employees[index] = { ...this.selectedEmployee, ...this.employeeForm.value };
        localStorage.setItem('employees', JSON.stringify(employees));
      }

      alert('Employee updated successfully!');
      this.selectedEmployee = null;
      this.createForm();

      // Ensure UI refreshes after update
      setTimeout(() => {
        this.loadEmployees();
      }, 100);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  onDelete(empId: number | undefined): void {
    if (empId !== undefined && confirm('Are you sure you want to delete?')) {
      let employees: Employee[] = JSON.parse(localStorage.getItem('employees') || '[]');
      employees = employees.filter(emp => emp.empId !== empId);
      localStorage.setItem('employees', JSON.stringify(employees));
      this.loadEmployees();
      alert('Employee deleted successfully!');
    }
  }

  onReset(): void {
    this.createForm();
    this.selectedEmployee = null;
  }

  trackByEmpId(index: number, emp: Employee): number {
    return emp.empId ?? 0;
  }
}
