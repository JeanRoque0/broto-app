import { supabase } from "@/services/supabase/client";

export async function signInWithEmail(payload: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(payload: {
  email: string;
  password: string;
  name: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: { data: { name: payload.name } },
  });

  if (error) throw error;
  return data;
}

export async function resendConfirmation(email: string) {
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) throw error;
}

export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}


export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function deleteAccount() {
  const { error } = await supabase.functions.invoke("delete-account", {
    method: "POST",
  });

  if (error) throw error;
  await supabase.auth.signOut();
}
