import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILabel } from 'app/shared/model/label.model';

@Component({
  selector: 'jhi-label-detail',
  templateUrl: './label-detail.component.html'
})
export class LabelDetailComponent implements OnInit {
  label: ILabel | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ label }) => {
      this.label = label;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
