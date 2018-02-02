import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [],
  controllers: [AppController],
  components: [],
  modules: [WalletModule],
})
export class ApplicationModule { }
