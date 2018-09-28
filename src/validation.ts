import { EthereumTypes } from '@ethercast/model';

const ethereumApiTypesSchema = require('@ethercast/model/build/ethereum-types-schema.json');

/**
 * @hidden
 */
const Ajv = require('ajv');

/**
 * @hidden
 */
const ajv = new Ajv({ allErrors: true });

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
ajv.addSchema(ethereumApiTypesSchema);

export class ConvertedError extends Error {
  errors: typeof Ajv.errors;
}

/**
 * @hidden
 */
export function convertError(errors: typeof Ajv.errors): Error {
  if (!errors || !Array.isArray(errors) || errors.length === 0) {
    return new Error('unknown validation error occurred');
  }

  const err: ConvertedError = new ConvertedError(
    errors
      .map(
        ({ propertyName, keyword, dataPath, schemaPath, message }) =>
          [
            propertyName,
            message
          ].filter(s => typeof s === 'string' && s.length > 0).map(s => s.trim()).join(' - ')
      )
      .join('; ')
  );

  err.errors = errors;

  return err;
}

/**
 * @hidden
 */
export function validate<TValue, TSchema extends { definitions: { [param: string]: any } }>(
  value: any,
  scheme: TSchema,
  schemaKey: string
): TValue {
  if (typeof scheme.definitions[schemaKey] === 'undefined') {
    throw new Error(`invalid schema key: ${schemaKey}`);
  }

  const valid = ajv.validate(`#/definitions/${schemaKey}`, value);

  if (!valid) {
    throw convertError(ajv.errors);
  } else {
    return value;
  }
}

export function mustBeValidLog(log: any): EthereumTypes.Log {
  return validate(log, ethereumApiTypesSchema, 'Log');
}

export function mustBeValidDecodedLog(decodedLog: any): EthereumTypes.DecodedLog {
  return validate(decodedLog, ethereumApiTypesSchema, 'DecodedLog');
}

export function mustBeValidBlockWithTransactionHashes(block: any): EthereumTypes.BlockWithTransactionHashes {
  return validate(block, ethereumApiTypesSchema, 'BlockWithTransactionHashes');
}

export function mustBeValidBlockWithFullTransactions(block: any): EthereumTypes.BlockWithFullTransactions {
  return validate(block, ethereumApiTypesSchema, 'BlockWithFullTransactions');
}

export function mustBeValidTransaction(transaction: any): EthereumTypes.Transaction {
  return validate(transaction, ethereumApiTypesSchema, 'Transaction');
}

export function mustBeValidDecodedTransaction(decodedTransaction: any): EthereumTypes.DecodedTransaction {
  return validate(decodedTransaction, ethereumApiTypesSchema, 'DecodedTransaction');
}

export function mustBeValidTransactionReceipt(transactionReceipt: any): EthereumTypes.TransactionReceipt {
  return validate(transactionReceipt, ethereumApiTypesSchema, 'TransactionReceipt');
}
