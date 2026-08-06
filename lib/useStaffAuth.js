"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function useStaffAuth() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [role, setRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setRole(null);
      return;
    }
    supabase
      .from("staff_profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => setRole(data?.role || null));
  }, [session]);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  return {
    loading: session === undefined,
    user: session?.user || null,
    role,
    signIn,
    signOut,
  };
}