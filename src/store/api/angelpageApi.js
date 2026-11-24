import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

let apiAuthToken = null;

export const setApiAuthToken = token => {
  apiAuthToken = token || null;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: headers => {
    if (apiAuthToken) {
      headers.set('Authorization', `Bearer ${apiAuthToken}`);
    }
    return headers;
  },
});

export const angelpageApi = createApi({
  reducerPath: 'angelpageApi',
  baseQuery,
  tagTypes: ['Product', 'ProductList', 'CharityList', 'BlogList', 'Blog', 'EventList', 'Event'],
  keepUnusedDataFor: 300,
  endpoints: builder => ({
    getProductDetails: builder.query({
      query: slug => ({
        url: `/products/details/${slug}`,
        params: { isArchived: false },
      }),
      transformResponse: response => response.product,
      providesTags: (result, error, slug) => [
        { type: 'Product', id: slug },
      ],
    }),
    getLatestProducts: builder.query({
      query: () => ({
        url: '/products/listing/latest-products',
        params: { isArchived: false, status: 'LIVE' },
      }),
      transformResponse: response => response.products || [],
      providesTags: [{ type: 'ProductList', id: 'LATEST' }],
    }),
    getProductsByCategoryPath: builder.query({
      query: category => ({
        url: `/products/category/${category}`,
        params: { isArchived: false, status: 'LIVE' },
      }),
      transformResponse: response => response.products || [],
      providesTags: (result, error, category) => [
        { type: 'ProductList', id: `CATEGORY-${category}` },
      ],
    }),
    getCategoryProducts: builder.query({
      query: ({ category = '', subcategory = '', status = 'LIVE' } = {}) => ({
        url: '/products/category',
        params: { category, subcategory, status },
      }),
      transformResponse: response => response.products || [],
      providesTags: (result, error, arg) => [
        {
          type: 'ProductList',
          id: `CAT-${arg?.category || 'all'}-${arg?.subcategory || ''}`,
        },
      ],
    }),
    getAllProducts: builder.query({
      query: (params = {}) => ({
        url: '/products/all',
        params: { status: 'LIVE', ...params },
      }),
      transformResponse: response => response.products || [],
      providesTags: (result, error, params) => [
        {
          type: 'ProductList',
          id: params?.promoted ? 'PROMOTED' : 'ALL',
        },
      ],
    }),
    getRelatedProducts: builder.query({
      query: ({ category }) => ({
        url: '/products/related',
        params: { category, isArchived: false, status: 'LIVE' },
      }),
      transformResponse: response => response.products || [],
      providesTags: (result, error, { category }) => [
        { type: 'ProductList', id: `RELATED-${category}` },
      ],
    }),
    getCharities: builder.query({
      query: ({ page = 1, limit = 12, search = '' } = {}) => ({
        url: '/charity/charities',
        params: { page, limit, search },
      }),
      providesTags: (result, error, { page, search }) => [
        { type: 'CharityList', id: `${page}-${search || ''}` },
      ],
    }),
    getBlogPosts: builder.query({
      query: ({ limit } = {}) => ({
        url: '/blog',
        params: limit ? { limit } : undefined,
      }),
      transformResponse: response => response.posts || [],
      providesTags: [{ type: 'BlogList', id: 'LIST' }],
    }),
    getBlogBySlug: builder.query({
      query: slug => `/blog/slug/${slug}`,
      transformResponse: response => response.post,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
    }),
    getEvents: builder.query({
      query: ({ limit = 24, eventType, featured } = {}) => ({
        url: '/events',
        params: {
          limit,
          ...(eventType ? { eventType } : {}),
          ...(featured ? { featured: 'true' } : {}),
        },
      }),
      transformResponse: response => response.events || [],
      providesTags: (result, error, { eventType }) => [
        { type: 'EventList', id: eventType || 'ALL' },
      ],
    }),
    getEventBySlug: builder.query({
      query: slug => `/events/slug/${slug}`,
      transformResponse: response => response.event,
      providesTags: (result, error, slug) => [{ type: 'Event', id: slug }],
    }),
  }),
});

export const {
  useGetProductDetailsQuery,
  useLazyGetProductDetailsQuery,
  useGetLatestProductsQuery,
  useGetProductsByCategoryPathQuery,
  useGetCategoryProductsQuery,
  useGetAllProductsQuery,
  useGetRelatedProductsQuery,
  useGetCharitiesQuery,
  useGetBlogPostsQuery,
  useGetBlogBySlugQuery,
  useGetEventsQuery,
  useGetEventBySlugQuery,
} = angelpageApi;
