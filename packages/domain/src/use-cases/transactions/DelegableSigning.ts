import { PromiseResult } from '@lens-protocol/shared-kernel';

import {
  ProtocolTransactionRequestModel,
  AnyTransactionRequestModel,
  Transaction,
} from '../../entities';
import { BroadcastingError } from './BroadcastingError';
import { ITransactionResultPresenter } from './ITransactionResultPresenter';
import { TransactionQueue } from './TransactionQueue';

type WithDelegateFlag<T extends ProtocolTransactionRequestModel> = T & {
  delegate: boolean;
};

export type DelegableProtocolTransactionRequestModel =
  WithDelegateFlag<ProtocolTransactionRequestModel>;

export interface ISignedOperation<TSigned extends ProtocolTransactionRequestModel> {
  execute(request: TSigned): Promise<void>;
}

export interface IDelegatedTransactionGateway<TDelegable extends ProtocolTransactionRequestModel> {
  createDelegatedTransaction(
    request: TDelegable,
  ): PromiseResult<Transaction<TDelegable>, BroadcastingError>;
}

export type IDelegatedTransactionPresenter<TDelegable extends ProtocolTransactionRequestModel> =
  ITransactionResultPresenter<TDelegable, BroadcastingError>;

export class DelegableSigning<
  TSigned extends ProtocolTransactionRequestModel,
  TDelegable extends WithDelegateFlag<TSigned> = WithDelegateFlag<TSigned>,
> {
  constructor(
    private readonly signedOperation: ISignedOperation<TSigned>,
    private readonly transactionGateway: IDelegatedTransactionGateway<TDelegable>,
    private readonly transactionQueue: TransactionQueue<AnyTransactionRequestModel>,
    private readonly presenter: IDelegatedTransactionPresenter<TDelegable>,
  ) {}

  async execute(request: TDelegable): Promise<void> {
    if (request.delegate) {
      const result = await this.transactionGateway.createDelegatedTransaction(request);

      if (result.isFailure()) {
        this.presenter.present(result);
        return;
      }

      const transaction = result.value;
      await this.transactionQueue.push(transaction, this.presenter);
      return;
    }
    return this.signedOperation.execute(request);
  }
}
