import { Input, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  sendAmount(amount: number) {
    console.log('sendAmount', amount);
  }
}
