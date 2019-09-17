import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerTypeService } from '../../services/customer-type.service';
import { CustomerType } from '../../models/customer-type';

import { PnotifyService } from '../../utils/pnotify.service';
import { ModalDirective } from 'ngx-bootstrap';
import { Page } from '../../models/page';

@Component({
  selector: 'app-customer-type',
  templateUrl: './customer-type.component.html',
  styleUrls: ['./customer-type.component.scss']
})
export class CustomerTypeComponent implements OnInit {
  @ViewChild('editModal', { static: false }) editModal: ModalDirective;
  closeResult: string;
  action: string;
  page: Page = { pageNumber: 0, pageSize: 5} as Page;
  //
  id: string;
  customerTypes: CustomerType[] = [];
  customerType: CustomerType = {} as CustomerType;
  columns = [
    {name: 'Name', prop: 'name', sortTable: true},
    {name: 'Commission', sortTable: true},

  ];
  constructor(private customerTypeService: CustomerTypeService, private pnotifyService: PnotifyService ) {}
    // route: lay tham so , routeService chuyen huong
  ngOnInit() {
    //
    this.loadDatas();
  }
  // load list
  loadDatas(page = null) {
    if ( page != null) {
      this.page.pageNumber = page.offset;
    }
    this.customerTypeService.list(this.page).subscribe(res => {
      this.page = res.pageInfo;
      this.customerTypes = res.data;
    });
  }
  // load a data
  loadData(id) {
    this.customerTypeService.get(id).subscribe( res => {
      this.customerType = res.data;
    });
  }
  // save
  save() {
    this.customerTypeService.save(this.customerType).subscribe(( res => {
      if (res.errorCode === 0) {
        this.editModal.hide();
        this.loadDatas();
        this.customerType = {} as CustomerType;
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
        this.customerTypeService.delete(id).subscribe( res => {
          if ( res.errorCode === 0) {
            this.pnotifyService.success('Info', 'Delete susess');
            this.loadDatas();
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
    this.customerType = { id: 0 } as CustomerType;
    this.editModal.show();
  }
  openEdit(event, id) {
    event.preventDefault();
    this.action = 'Edit';
    // load data here by id, then show dialog
    this.customerTypeService.get(id).subscribe( res => {
      this.customerType = res.data;
      this.editModal.show();
    });
  }

}
