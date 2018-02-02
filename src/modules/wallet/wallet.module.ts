import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  controllers: [
    WalletController
  ],
  components: [
    WalletService
  ]
})
export class WalletModule {}
