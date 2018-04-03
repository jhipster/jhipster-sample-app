import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOperation } from 'app/shared/model/operation.model';

@Component({
  selector: 'jhi-operation-detail',
  templateUrl: './operation-detail.component.html'
})
export class OperationDetailComponent implements OnInit {
  operation: IOperation;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ operation }) => {
      this.operation = operation.body ? operation.body : operation;
    });
  }

  previousState() {
    window.history.back();
  }
}
