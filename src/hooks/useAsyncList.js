"use client";

import { useEffect, useState } from "react";

// `loader` must be a stable function (defined outside the component)
export function useAsyncList(loader) {
  const [state, setState] = useState({ items: [], loading: true, error: false });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    loader()
      .then((items) => active && setState({ items, loading: false, error: false }))
      .catch(() => active && setState({ items: [], loading: false, error: true }));
    return () => {
      active = false;
    };
  }, [loader, nonce]);

  const reload = () => {
    setState((s) => ({ ...s, loading: true, error: false }));
    setNonce((n) => n + 1);
  };

  return { ...state, reload };
}