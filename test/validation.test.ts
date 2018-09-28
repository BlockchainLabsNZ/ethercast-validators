import 'mocha';
import { expect } from 'chai';
import {
  mustBeValidBlockWithFullTransactions,
  mustBeValidBlockWithTransactionHashes,
  mustBeValidDecodedLog,
  mustBeValidDecodedTransaction,
  mustBeValidLog,
  mustBeValidTransaction,
  mustBeValidTransactionReceipt,
  validate
} from '../src';
import {
  PARITY_EXAMPLE_BLOCK_WITH_FULL_TRANSACTIONS,
  PARITY_EXAMPLE_EMPTY_BLOCK,
  PARITY_EXAMPLE_NO_FROM_BLOCK, PARITY_EXAMPLE_TRANSACTION_RECEIPT, PARITY_TX_NO_TOPICS, PARITY_TX_RECEIPT_NO_LOGS
} from './parity-fixtures';

const schema = require('@ethercast/model/build/ethereum-types-schema.json');

describe('#validate', () => {
  it('throws invalid hex', () => {
    expect(() => validate('abc', schema, 'Hex')).to.throw('should match pattern');
  });

  it('succeeds with valid hex', () => {
    expect(() => validate('0x', schema, 'Hex')).to.not.throw();
    expect(() => validate('0xabc', schema, 'Hex')).to.not.throw();
    expect(() => validate('0xABC', schema, 'Hex')).to.not.throw();
    expect(() => validate('0xAd29013', schema, 'Hex')).to.not.throw();
  });

  it('fails with invalid blocks', () => {
    expect(() => validate({}, schema, 'Block')).to.throw('should have required property');
    expect(() => validate({ blockNumber: 'abc' }, schema, 'Block')).to.throw();
    expect(() => validate({ hash: 'ahs' }, schema, 'Block')).to.throw();
    expect(() => validate({ unknown: 'key' }, schema, 'Block')).to.throw();

    expect(() => validate({ unknown: 'key' }, schema, 'Block')).to.throw();
  });
});

//
describe('#mustBeValid*', () => {
  describe('parity', () => {
    it('block with full transactions', () => {
      expect(() => mustBeValidBlockWithFullTransactions(PARITY_EXAMPLE_BLOCK_WITH_FULL_TRANSACTIONS)).to.not.throw();
    });

    it('empty block', () => {
      expect(() => mustBeValidBlockWithFullTransactions(PARITY_EXAMPLE_EMPTY_BLOCK)).to.not.throw();
      expect(() => mustBeValidBlockWithTransactionHashes(PARITY_EXAMPLE_EMPTY_BLOCK)).to.not.throw();
    });

    it('transactions without from address', () => {
      expect(() => mustBeValidBlockWithFullTransactions(PARITY_EXAMPLE_NO_FROM_BLOCK)).to.not.throw();
    });

    it('tx receipt without logs', () => {
      expect(() => mustBeValidTransactionReceipt(PARITY_TX_RECEIPT_NO_LOGS)).to.not.throw();
    });

    it('transaction no topics', () => {
      expect(() => mustBeValidTransaction(PARITY_TX_NO_TOPICS)).to.not.throw();
    });

    it('example tx receipt', () => {
      expect(() => mustBeValidTransactionReceipt(PARITY_EXAMPLE_TRANSACTION_RECEIPT)).to.not.throw();
    });
  });
});

// test('#mustBeValid...', t => {
//   t.notThrows(() => mustBeValidLog(PARITY_EXAMPLE_TRANSACTION_RECEIPT.logs[0]));
//   t.throws(() => mustBeValidLog(PARITY_TX_RECEIPT_NO_LOGS));
//   t.notThrows(() =>
//     mustBeValidBlockWithFullTransactions(PARITY_EXAMPLE_BLOCK_WITH_FULL_TRANSACTIONS)
//   );
//   t.throws(() => mustBeValidDecodedTransaction(PARITY_TX_NO_TOPICS));
//   t.notThrows(() => mustBeValidTransactionReceipt(PARITY_TX_RECEIPT_NO_LOGS));
//   t.notThrows(() => mustBeValidBlockWithFullTransactions(PARITY_EXAMPLE_EMPTY_BLOCK));
//   t.notThrows(() => mustBeValidBlockWithTransactionHashes(PARITY_EXAMPLE_EMPTY_BLOCK));
//   t.throws(() => mustBeValidDecodedLog(PARITY_EXAMPLE_EMPTY_BLOCK));
//   t.throws(() => mustBeValidTransaction(PARITY_EXAMPLE_EMPTY_BLOCK));
// });
