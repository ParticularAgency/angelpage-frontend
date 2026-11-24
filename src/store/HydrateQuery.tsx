'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { angelpageApi } from './api/angelpageApi';
import type { AppDispatch } from './types';

type HydrateEntry = {
  endpointName: string;
  arg: unknown;
  data: unknown;
};

/**
 * Seeds RTK Query cache from server-fetched data so client hooks
 * skip the initial network round-trip (SSR → client hydration pattern).
 */
export default function HydrateQuery({ entries }: { entries: HydrateEntry[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current || !entries.length) return;
    hydrated.current = true;

    entries.forEach(({ endpointName, arg, data }) => {
      if (data == null) return;
      dispatch(
        angelpageApi.util.upsertQueryData(
          endpointName as never,
          arg as never,
          data as never
        )
      );
    });
  }, [dispatch, entries]);

  return null;
}
