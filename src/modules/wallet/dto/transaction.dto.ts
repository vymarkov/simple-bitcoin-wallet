import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/core';

import * as bitcore from 'bitcore-explorers/node_modules/bitcore-lib';
import { IsDefined, IsNumberString, IsNotEmpty } from 'class-validator';
import * as assert from 'assert-plus';

export class CreateTransactionDto {
  @IsNumberString()
  @IsNotEmpty()
  @IsDefined()
  public amount: string;

  @IsNotEmpty()
  @IsDefined()
  public address: string;

  @IsNotEmpty()
  @IsDefined()
  public private_key: string;

  constructor(data: CreateTransactionDto) {
    assert.object(data, 'data');
    // TODO: need to validate address
    assert.string(data.address, 'address');
    // TODO: need to validate private key
    assert.string(data.private_key, 'private_key');
    assert.string(data.amount, 'amount');

    const satoshis = bitcore.Unit.fromMilis(data.amount).toSatoshis();
    if (isNaN(satoshis)) {
      throw new HttpException('Amount should be a number', HttpStatus.BAD_REQUEST);
    }
    if (satoshis <= 0) {
      throw new HttpException('Amount should be not negative', HttpStatus.BAD_REQUEST);
    }
    this.address = data.address;
    this.private_key = data.private_key;
    this.amount = data.amount;
  }
}