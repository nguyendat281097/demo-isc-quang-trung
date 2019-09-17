import { Component, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../models/customer';
import { CustomerService } from '../../services/customer.service';
import { CustomerType } from '../../models/customer-type';
import { CustomerTypeService } from '../../services/customer-type.service';
import { Page } from '../../models/page';
import { ModalDirective } from 'ngx-bootstrap';
import { PnotifyService } from '../../utils/pnotify.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  @ViewChild('editModal', { static: false }) editModal: ModalDirective;
  customerTypes: [CustomerType];
  customerTypeId: number = 0;
  action: string;
  page: Page = { pageNumber: 0, pageSize: 5} as Page;
 //
 customers: Customer[] = [];
 customer: Customer = {} as Customer;
 columns = [
   {name: 'Customer Name', prop: 'name', sortTable: true},
   {name: 'Phone', sortTable: true},
   {name: 'Email', sortTable: true},
   {name: 'Address', sortTable: true},
   {name: 'Customer Type', prop: 'customerType.name', sortTable: true},
 ];
 cusForm: FormGroup;
//  customers: [Customer];
 constructor(private customerService: CustomerService,
  private customerTypeService: CustomerTypeService, private pnotifyService: PnotifyService, private fb: FormBuilder ) {
  this.customerTypeService.getAll().subscribe(res => {
    this.customerTypes = res.data;
  });
  }

 ngOnInit() {
  this.loadCustomer();
  this.cusForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: ['', [Validators.required]],
    customerType: this.fb.group({
      id: [''],
      name: [''],
      commission: [''],
    })
  });
 }
setForm() {
  // dung setValue de set lai gia tri cua toan bo form
  // dung pathValue khi set lai gia tri cua 1 vai control form
  this.cusForm.setValue({
    name: this.customer.name,
    email: this.customer.email,
    phone: this.customer.phone,
    address: this.customer.address,
    customerType: {
      id: this.customer.customerType.id,
      name: this.customer.customerType.name,
      commission: this.customer.customerType.commission,
    }
  });
 }
 getForm() {
   this.customer.name = this.cusForm.get('name').value;
   this.customer.email = this.cusForm.get('email').value;
   this.customer.phone = this.cusForm.get('phone').value;
   this.customer.address = this.cusForm.get('address').value;
   this.customer.CUT_ID = this.cusForm.get('customerType').get('id').value;
 }
loadCustomer(page = null) {
  if ( page != null) {
    this.page.pageNumber = page.offset;
  }
  // tslint:disable-next-line: triple-equals
  if (this.customerTypeId == 0) {
    this.customerService.list(this.page).subscribe(res => {
      this.page = res.pageInfo;
      this.customers = res.data;
    });
  } else {
    this.customerService.getByType(this.customerTypeId, this.page).subscribe( res => {
      this.page = res.pageInfo;
      this.customers = res.data;
    });
  }
}
loadData(id) {
  this.customerService.get(id).subscribe( res => {
    this.customer = res.data;
  });
}
// save
save() {
  this.getForm();
  this.customerService.save(this.customer).subscribe(( res => {
    if (res.errorCode === 0) {
      this.editModal.hide();
      this.loadCustomer();
      this.customer = {} as Customer;
      this.pnotifyService.success('Info', 'Update susess');
    } else {
      this.pnotifyService.error('Info', 'Update failed');
    }
  }), err => {
    this.pnotifyService.error('Info', 'Update failed');
  });
}

// delete
delete(event, id) {
  event.preventDefault();
  this.pnotifyService.showConfirm('Warnning', 'Are you sure?', yes => {
    if (yes) {
      this.customerService.delete(id).subscribe( res => {
        if ( res.errorCode === 0) {
          this.pnotifyService.success('Info', 'Delete susess');
          this.loadCustomer();
        } else {
          if ( res.errorCode === 200) {
            this.pnotifyService.error('Info', 'Delete failed. Data is associated with other objects.');
          } else {
            this.pnotifyService.error('Info', 'Delete failed');
          }
        }
      });
    }
  });
}
// su dung voi the a co gan link, button khong can
// deletes(event, id) {
//   event.preventDefault();
//   this.customerTypeService.delete(id).subscribe();
//   this.customerTypes.forEach((element, index) => {
//     if ( element.id === id ) {
//       this.customerTypes.splice(index, 1);
//     }
//   });
// }

// modals
hideModal() {
this.editModal.hide();
}

// show modal
openAdd() {
  this.action = 'Add';
  this.customer = { id: 0 } as Customer;
  this.cusForm.reset();
  this.editModal.show();
}
openEdit(event, id) {
  event.preventDefault();
  this.action = 'Edit';
  // load data here by id, then show dialog
  this.customerService.get(id).subscribe( res => {
    this.customer = res.data;
    this.setForm();
    this.editModal.show();
  });
}
}
