import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@firebase/firestore-types';

@Pipe({
  name: 'timestampToHourString',
  standalone: true,
})
export class TimestampToHourStringPipe implements PipeTransform {
  transform(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }
}
