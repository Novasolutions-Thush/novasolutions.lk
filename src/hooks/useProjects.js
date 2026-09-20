"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/projects";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;

    getProjects()
      .then((list) => {
        if (!active) return;
        setProjects(list);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [nonce]);

  const reload = () => {
    setLoading(true);
    setError(false);
    setNonce((n) => n + 1);
  };

  return { projects, loading, error, reload };
}