import { IPost, PostCategory } from 'types/post/common';

export const REDIS_ZADD_KEY = 'LIST_LENGTH';
export const REDIS_RECOMMEND_POST_KEY = 'REDIS_RECOMMEND_POST_KEY';

export const generateRedisViewsCategoryKey = (category: PostCategory) =>
  `views:${category}`;
export const generateRedisRecommendedCategoryKey = (category: PostCategory) =>
  `recommended:${category}`;
export const generateRedisPostIdKey = (postId: IPost['id']) => `post:${postId}`;
