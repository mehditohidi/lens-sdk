import { FieldFunctionOptions } from '@apollo/client/cache/inmemory/policies';
import { PublicationId } from '@lens-protocol/domain/entities';

import {
  OpenActionCategoryType,
  PublicationOperationsActedArgs,
  StrictTypedTypePolicies,
  TriStateValue,
} from '../../../lens';
import { countAnyPendingCollectFor } from '../transactions';

type PublicationOperationsCanActArgs = {
  request?: PublicationOperationsActedArgs;
};

function isCanCollectAlias(args: PublicationOperationsCanActArgs) {
  return args?.request?.filter?.category === OpenActionCategoryType.Collect;
}

export function createPublicationOperationsTypePolicy(): StrictTypedTypePolicies['PublicationOperations'] {
  return {
    fields: {
      canAct: {
        read(
          existing: TriStateValue | undefined,
          { args, readField }: FieldFunctionOptions<PublicationOperationsCanActArgs>,
        ) {
          // if we don't know if we can act, we can't do any optimistic updates
          if (!existing || existing === TriStateValue.Unknown) {
            return existing;
          }

          if (args && isCanCollectAlias(args)) {
            const id = readField('id') as PublicationId;

            return countAnyPendingCollectFor(id) > 0 ? TriStateValue.No : TriStateValue.Yes;
          }

          return existing;
        },
      },
    },
  };
}
