import { api } from './api';

function getStoredSession() {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  return token ? { access_token: token } : null;
}

export const auth = {
  signIn: async (email: string, password: string) => {
    const data = await api.login(email, password);
    return {
      ...data,
      session: data.session || { access_token: data.token },
    };
  },

  signOut: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  getSession: async () => {
    const session = getStoredSession();

    if (!session) {
      return null;
    }

    try {
      const { user } = await api.getMe();
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);
      return session;
    } catch {
      await auth.signOut();
      return null;
    }
  },
};
