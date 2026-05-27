import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  imports: [TranslateDirective],
})
export default class Footer {}
