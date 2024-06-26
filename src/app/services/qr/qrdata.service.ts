import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrdataService {
  baseUrl: string = 'https://apiqr-production.up.railway.app/users/';

  constructor(private http: HttpClient) {}

  getData(id: string): Promise<string> {
    return firstValueFrom(
      this.http
        .get(this.baseUrl + id)
        .pipe(map((response) => JSON.stringify(response)))
    );
  }
}
