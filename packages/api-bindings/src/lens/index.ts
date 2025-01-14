import { StoreValue } from '@apollo/client';

import { PaginatedResultInfo } from './graphql/generated';

export * from './graphql/generated';
export type {
  Digit,
  ImageSizeTransform,
  ImageTransform, // shadows the less type-safe generated ImageTransform
  Percentage,
  Pixel,
} from './ImageTransform';
export * from './utils';
export * from './publication';
export * from './profile';
export * from './MetadataAttribute';
export * from './ContentInsight';
export * from './Cursor';
export * from './FollowPolicy';

export type CursorBasedPaginatedResult<T = StoreValue> = {
  items: T[];
  pageInfo: PaginatedResultInfo;
};
