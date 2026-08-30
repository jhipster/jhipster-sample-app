import { Pipe, PipeTransform } from '@angular/core';

import dayjs from 'dayjs/esm';
// Plugins are registered in app/config/dayjs, the type augmentations are required when the pipe is built standalone.
import 'dayjs/esm/plugin/duration';
import 'dayjs/esm/plugin/relativeTime';

@Pipe({
  name: 'duration',
})
export default class DurationPipe implements PipeTransform {
  transform(value: any): string {
    if (value) {
      return dayjs.duration(value).humanize();
    }
    return '';
  }
}
