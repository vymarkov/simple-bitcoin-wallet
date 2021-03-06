import { promisify } from 'util';
import { Component, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/core';

import * as bitcoin from 'bitcoinjs-lib';
import * as bitcore from 'bitcore-explorers/node_modules/bitcore-lib';
import * as explorers from 'bitcore-explorers';
import { CreateTransactionDto } from './dto/transaction.dto';

export type WalletAddress = string;

export type Wif = string;

export class UnspentTransactionOutput {
  address: WalletAddress;
  amount: number;
  scriptPubKey: string;
  txid: string;
  vout: number;
}

export class TransactionDto {
  public txID: string;
}

@Component()
export class WalletService {
  private readonly minerFee: number = bitcore.Unit.fromMilis(0.128).toSatoshis();
  private readonly insight = new explorers.Insight('https://test-insight.bitpay.com', 'testnet');
  private readonly bitcoinNetwork: bitcoin.Network = bitcoin.networks.testnet;

  constructor() {
    this.insight.address = promisify(this.insight.address);
    this.insight.getUnspentUtxos = promisify(this.insight.getUnspentUtxos);
    this.insight.broadcast = promisify(this.insight.broadcast);
  }

  public async getBalance(address: WalletAddress) {
    const data = await this.insight.address(address);
    const utxos = await this.getUnspentUtxos(address);
    const balance = utxos.reduce((acc: number, { satoshis }: any) => {
      return acc + satoshis;
    }, 0);

    return { utxos, balance, address };
  }

  public async createWallet(): Promise<Wif> {
    const keyPair = bitcoin.ECPair.makeRandom({ network: this.bitcoinNetwork });
    return keyPair.toWIF();
  }

  public async test() {
    const wif = 'cPw26SN1VXvX4X43mDjy7ngwtD4XStGi9GUCNKnePDrVY47QbLaY';
    const privateKey = new bitcore.PrivateKey(wif);
    const fromaddress = privateKey.toAddress();
    const toaddress = 'mynV8F68zW66TmEw7W8Y1srNPurMRkJpDK';
    return this.createTransaction(privateKey, '0.05', fromaddress, toaddress);
  }

  public async sendAmount(tx: CreateTransactionDto) {
    if (!tx.address || !tx.private_key || !tx.amount) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    const privateKey = new bitcore.PrivateKey(tx.private_key);
    const fromaddress = tx.address;

    const wallet = await this.createWallet();
    const toaddress = new bitcore.PrivateKey(wallet).toAddress();

    const txID = await this.createTransaction(privateKey, tx.amount, fromaddress, toaddress);
    return { address: toaddress.toString(), txID };
  }

  public async createTransaction(privatekey, amount: string, fromaddress: WalletAddress, toaddress: WalletAddress) {
    const { utxos, balance } = await this.getBalance(fromaddress);
    if (balance <= 0) {
      throw new HttpException('You don\'t have enough Satoshis to cover the miner fee.', HttpStatus.BAD_REQUEST);
    }
    const transactionAmount = bitcore.Unit.fromMilis(amount).toSatoshis();
    if (transactionAmount + this.minerFee > balance) {
      throw new HttpException('You don\'t have enough Satoshis to cover the miner fee.', HttpStatus.BAD_REQUEST);
    }

    const transaction = new bitcore.Transaction()
      .from(utxos)
      .to(toaddress, transactionAmount)
      .fee(this.minerFee)
      .change(fromaddress)
      .sign(privatekey);

    const err = transaction.getSerializationError();
    if (err) {
      // FIXME: create error constructors for business logic errors
      throw new HttpException(err.messsage, HttpStatus.BAD_REQUEST);
    }
    return this.broadcast(transaction);
  }

  private async getUnspentUtxos(address: WalletAddress): Promise<UnspentTransactionOutput[]> {
    return this.insight.getUnspentUtxos(address);
  }

  private async broadcast(trx) {
    // TODO: handle any errors and wrap into user friendly errors
    const tid = await this.insight.broadcast(trx);
    return tid;
  }
}
