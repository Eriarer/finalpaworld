import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@firebase/firestore-types';

@Pipe({
  name: 'timestampToDateString',
  standalone: true,
})
export class TimestampToDateStringPipe implements PipeTransform {
  transform(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses comienzan desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
