import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { WalletService } from './wallet.service';
import { expect } from 'chai';

describe('WalletService', () => {
  let module: TestingModule;
  beforeEach(() => {
    return Test.createTestingModule({
      components: [
        WalletService
      ]
    }).compile()
      .then(compiledModule => module = compiledModule);
  });

  let service: WalletService;
  beforeEach(() => {
    service = module.get(WalletService);
  });

  it('should exist', () => {
    expect(service).to.exist;
  });
});
