import {
  PendingSigningRequestError,
  TransactionKind,
  UserRejectedError,
  WalletConnectionError,
} from '@lens-protocol/domain/entities';
import { BroadcastingError } from '@lens-protocol/domain/use-cases/transactions';
import { invariant } from '@lens-protocol/shared-kernel';

import { SessionType, useSession } from '../authentication';
import { UseDeferredTask, useDeferredTask } from '../helpers/tasks';
import { AsyncTransactionResult } from './adapters/AsyncTransactionResult';
import { useLinkHandleController } from './adapters/useLinkHandleController';

export type LinkHandleArgs = {
  /**
   * The owned handle to link to the currently authenticated Profile.
   */
  handle: string;
};

/**
 * `useLinkHandle` allows you to link an owned handle to your Profile.
 *
 * You MUST be authenticated via {@link useLogin} to use this hook.
 *
 * @example
 * ```tsx
 * const { execute, error, loading } = useLinkHandle();
 *
 * <button onClick={() => execute({ handle })} disabled={loading}>
 *   Link handle
 * </button>
 * ```
 *
 * @category Profiles
 * @group Hooks
 * @experimental This hook is experimental and may change in future releases.
 */
export function useLinkHandle(): UseDeferredTask<
  AsyncTransactionResult<void>,
  BroadcastingError | PendingSigningRequestError | UserRejectedError | WalletConnectionError,
  LinkHandleArgs
> {
  const { data: session } = useSession();
  const linkHandle = useLinkHandleController();

  return useDeferredTask(async (args) => {
    invariant(
      session?.authenticated,
      'You must be authenticated to use this operation. Use `useLogin` hook to authenticate.',
    );
    invariant(
      session.type === SessionType.WithProfile,
      'You must have a profile to use this operation.',
    );

    return linkHandle({
      kind: TransactionKind.LINK_HANDLE,
      handle: args.handle,
      delegate: session.profile.lensManager,
    });
  });
}
