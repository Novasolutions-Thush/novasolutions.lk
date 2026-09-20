"use client";

import { useEffect, useState } from "react";
import { subscribeMessages, subscribeUnreadCount } from "@/lib/messages";

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeMessages(
      (list) => {
        setMessages(list);
        setError(false);
        setLoading(false);
      },
      () => {
        setError(true);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return { messages, loading, error };
}

export function useUnreadCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeUnreadCount(setCount, () => setCount(0));
    return unsubscribe;
  }, []);

  return count;
}