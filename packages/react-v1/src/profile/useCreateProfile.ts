import { Profile } from '@lens-protocol/api-bindings';
import { TransactionError, TransactionKind } from '@lens-protocol/domain/entities';
import { DuplicatedHandleError, FollowPolicyConfig } from '@lens-protocol/domain/use-cases/profile';
import { BroadcastingError } from '@lens-protocol/domain/use-cases/transactions';
import { failure, PromiseResult, success, Url } from '@lens-protocol/shared-kernel';

import { Operation, useOperation } from '../helpers/operations';
import { useCreateProfileController } from './adapters/useCreateProfileController';

export type CreateProfileArgs = {
  /**
   * The profile handle
   */
  handle: string;

  /**
   * The initial follow policy
   *
   * @defaultValue anyone can follow
   */
  followPolicy?: FollowPolicyConfig;

  /**
   * The profile image URL
   *
   * @defaultValue no profile image
   */
  profileImage?: Url;
};

export { DuplicatedHandleError };

export type CreateProfileOperation = Operation<
  Profile,
  BroadcastingError | DuplicatedHandleError | TransactionError,
  [CreateProfileArgs]
>;

/**
 * `useCreateProfile` is a hook that lets you create a new profile
 *
 * The hook `execute` function resolves with a {@link Result} when the corresponding transaction is settled.
 * You can use the {@link Success.isSuccess | `Result.isSuccess`} (or {@link Failure.isFailure | `Result.isFailure`}) method
 * to determine the outcome of the operation.
 *
 * @category Profiles
 * @group Hooks
 *
 * @example
 * Simple usage
 * ```tsx
 * import { useCreateProfile } from '@lens-protocol/react-web';
 *
 * function CreateProfile() {
 *   const { error, execute, isPending } = useCreateProfile();
 *
 *   const onClick = async () => {
 *     const handle = window.prompt("Enter your handle");
 *
 *     const result = await execute({ handle });
 *
 *     if (result.isSuccess()) {
 *       console.log("Profile created!", result.value);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       { error && <p>{error.message}</p>}
 *       <button disabled={isPending} onClick={onClick}>
 *         Create profile
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Programmatic error handling
 * ```tsx
 * import { useCreateProfile, DuplicatedHandleError } from '@lens-protocol/react-web';
 *
 * function CreateProfile() {
 *   const { execute, isPending } = useCreateProfile();
 *
 *   const onClick = async () => {
 *     const handle = window.prompt("Enter your handle");
 *
 *     const result = await execute({ handle });
 *
 *     if (result.isSuccess()) {
 *       console.log("Profile created!", result.value);
 *       return;
 *     }
 *
 *     switch (result.error.constructor) {
 *       case DuplicatedHandleError:
 *         console.log("Handle already taken");
 *
 *       default:
 *         console.log(`Could not create profile due to: ${result.error.message}`);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button disabled={isPending} onClick={onClick}>
 *         Create profile
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCreateProfile(): CreateProfileOperation {
  const createProfile = useCreateProfileController();

  return useOperation(
    async ({
      handle,
    }: CreateProfileArgs): PromiseResult<
      Profile,
      BroadcastingError | DuplicatedHandleError | TransactionError
    > => {
      const broadcasted = await createProfile({
        handle,
        kind: TransactionKind.CREATE_PROFILE,
      });

      if (broadcasted.isFailure()) {
        return failure(broadcasted.error);
      }

      const result = await broadcasted.value.waitForCompletion();

      if (result.isFailure()) {
        return failure(result.error);
      }

      return success(result.value);
    },
  );
}
