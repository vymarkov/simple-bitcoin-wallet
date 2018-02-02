import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateTransactionDto } from './dto/transaction.dto';

@Controller('/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get('/:address/balance')
  public async getBalance( @Param('address') addres: string) {
    const balance = await this.walletService.getBalance(addres);
    return balance;
  }

  @Post('/transfer')
  public async createTransaction( @Body() transaction: CreateTransactionDto) {
    return this.walletService.sendAmount(new CreateTransactionDto(transaction));
  }

  @Post('/test')
  public async test() {
    return this.walletService.test();
  }
}
