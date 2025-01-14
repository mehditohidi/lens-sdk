import { CreateComment, CreateCommentRequest } from '@lens-protocol/domain/use-cases/publications';
import {
  DelegableSigning,
  SubsidizeOffChain,
  SubsidizeOnChain,
  TransactionData,
} from '@lens-protocol/domain/use-cases/transactions';

import { useSharedDependencies } from '../../shared';
import { NewPublicationPresenter } from './NewPublicationPresenter';
import { CreateMomokaCommentGateway } from './publications/CreateMomokaCommentGateway';
import { CreateOnChainCommentGateway } from './publications/CreateOnChainCommentGateway';

export function useCreateCommentController() {
  const {
    activeWallet,
    apolloClient,
    momokaRelayer,
    onChainRelayer,
    publicationCacheManager,
    transactionFactory,
    transactionGateway,
    transactionQueue,
  } = useSharedDependencies();

  return async (request: CreateCommentRequest) => {
    const presenter = new NewPublicationPresenter((tx: TransactionData<CreateCommentRequest>) =>
      publicationCacheManager.fetchNewComment(tx),
    );

    const onChainGateway = new CreateOnChainCommentGateway(apolloClient, transactionFactory);

    const onChainComment = new SubsidizeOnChain(
      activeWallet,
      transactionGateway,
      onChainGateway,
      onChainRelayer,
      transactionQueue,
      presenter,
    );

    const delegableOnChainComment = new DelegableSigning(
      onChainComment,
      onChainGateway,
      transactionQueue,
      presenter,
    );

    const offChainGateway = new CreateMomokaCommentGateway(apolloClient, transactionFactory);

    const momokaComment = new SubsidizeOffChain(
      activeWallet,
      offChainGateway,
      momokaRelayer,
      transactionQueue,
      presenter,
    );

    const delegableOffChainComment = new DelegableSigning(
      momokaComment,
      offChainGateway,
      transactionQueue,
      presenter,
    );

    const createComment = new CreateComment(delegableOnChainComment, delegableOffChainComment);

    await createComment.execute(request);

    return presenter.asResult();
  };
}
