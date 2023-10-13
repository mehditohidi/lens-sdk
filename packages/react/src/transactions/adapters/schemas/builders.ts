import { TransactionKind } from '@lens-protocol/domain/entities';
import {
  CreateCommentRequest,
  CreatePostRequest,
} from '@lens-protocol/domain/use-cases/publications';
import { never, RecursiveUnbrand } from '@lens-protocol/shared-kernel';
import { z } from 'zod';

import { formatZodError } from './formatters';
import { CreateCommentRequestSchema, CreatePostRequestSchema } from './publications';

function evaluate<Input, Output>(result: z.SafeParseReturnType<Input, Output>): Output {
  if (result.success) {
    return result.data;
  }
  never(formatZodError(result.error));
}

export function createCommentRequest(
  input: RecursiveUnbrand<Omit<CreateCommentRequest, 'kind'>>,
): CreateCommentRequest {
  return evaluate(
    CreateCommentRequestSchema.safeParse({
      kind: TransactionKind.CREATE_COMMENT,
      ...input,
    }),
  );
}

export function createPostRequest(
  input: RecursiveUnbrand<Omit<CreatePostRequest, 'kind'>>,
): CreatePostRequest {
  return evaluate(
    CreatePostRequestSchema.safeParse({
      kind: TransactionKind.CREATE_POST,
      ...input,
    }),
  );
}
