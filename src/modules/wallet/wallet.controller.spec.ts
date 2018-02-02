import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { WalletController } from './wallet.controller';
import { expect } from 'chai';

describe('WalletController', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      controllers: [WalletController]
    })
      .compile()
      .then(compiledModule => (module = compiledModule));
  });

  let controller: WalletController;
  beforeEach(() => {
    controller = module.get(WalletController);
  });

  it('should exist', () => {
    expect(controller).to.exist;
  });
});
