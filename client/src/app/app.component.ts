import { Input, Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  address = 'n1tnqLViTRLnYkWGBY2T5xztz95s6fdd5C';
  privateKey = 'e7a18dc5cfdaed65c222784a92dd1fe5135133660ac90f8cde6b9bd5fdab25bc';
  amount = 10;

  constructor(private readonly appService: AppService) { }

  sendAmount(privateKey, address: string, amount: number) {
    this.appService.sendAmount(privateKey, address, amount)
      .then(resp => {
        alert(`Sent to ${resp.address}! TX ID: ${resp.txID}`);
      });
  }
}
