// lib\actions.ts
// lib/actions.ts
'use server';

import { cookies } from 'next/headers';
import { User, AuthData } from './auth-types';

const USER_DETAILS_COOKIE_NAME = 'current_user_details';
const CLIENT_ACCESS_TOKEN_COOKIE_NAME = 'client_access_token_session';

export async function setAuthDataCookiesAction(authData: AuthData) {
  const cookieStore = cookies();

  cookieStore.set(CLIENT_ACCESS_TOKEN_COOKIE_NAME, authData.access_token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'lax',
  });

  cookieStore.set(USER_DETAILS_COOKIE_NAME, JSON.stringify(authData.user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'lax',
  });
}

export async function clearAuthCookiesAction() {
  const cookieStore = cookies();
  cookieStore.delete(CLIENT_ACCESS_TOKEN_COOKIE_NAME);
  cookieStore.delete(USER_DETAILS_COOKIE_NAME);
}

export async function getCurrentUserFromCookieAction(): Promise<User | null> {
  const cookieStore = cookies();
  const userCookie = cookieStore.get(USER_DETAILS_COOKIE_NAME)?.value;
  if (userCookie) {
    try {
      return JSON.parse(userCookie) as User;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      cookieStore.delete(USER_DETAILS_COOKIE_NAME);
      return null;
    }
  }
  return null;
}

export async function getClientAccessTokenFromCookieAction(): Promise<string | null> {
  const cookieStore = cookies();
  return cookieStore.get(CLIENT_ACCESS_TOKEN_COOKIE_NAME)?.value || null;
}

export async function updateUserDetailsCookieAction(user: User) {
  const cookieStore = cookies();
  cookieStore.set(USER_DETAILS_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'lax',
  });
}

export async function getAuthDataFromCookies(): Promise<AuthData | null> {
  const user = await getCurrentUserFromCookieAction();
  const token = await getClientAccessTokenFromCookieAction();

  if (user && token) {
    return { user, access_token: token };
  }
  return null;
}
