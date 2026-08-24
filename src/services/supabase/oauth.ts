import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

import { supabase } from "@/services/supabase/client";

const redirectTo = AuthSession.makeRedirectUri({
  scheme: "broto",
  path: "auth-callback",
});

const usedCodes = new Set<string>();

export async function exchangeAuthCode(code: string) {
  if (usedCodes.has(code)) return null;
  usedCodes.add(code);

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;
  return data.session;
}

export function readAuthCode(url: string) {
  const { queryParams } = Linking.parse(url);
  return typeof queryParams?.code === "string" ? queryParams.code : null;
}

export async function signInWithProvider(provider: "google") {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error) throw error;
  if (!data.url) throw new Error("Provedor não devolveu a URL de login.");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success") return null;

  const code = readAuthCode(result.url);
  if (!code) throw new Error("Login sem código de retorno.");

  return exchangeAuthCode(code);
}

export async function isAppleSignInAvailable() {
  if (Platform.OS !== "ios") return false;
  return AppleAuthentication.isAvailableAsync();
}

export async function signInWithApple() {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error("A Apple não devolveu o token de identidade.");
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
  });

  if (error) throw error;

  const name = credential.fullName?.givenName;
  if (name) {
    await supabase.auth.updateUser({ data: { name } });
  }

  return data.session;
}
