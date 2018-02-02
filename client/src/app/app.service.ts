import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService {

  constructor(private readonly httpClient: HttpClient) { }

  public sendAmount(privateKey: string, address: string, amount: number) {
    return this.httpClient.post('/wallet/transfer', {
      private_key: privateKey,
      address,
      amount,
    }).toPromise()
      .then((resp: { address: string, txID: string }) => resp);
  }

}
