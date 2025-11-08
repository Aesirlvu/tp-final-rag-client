import { create } from "zustand";

type Env = "DEV" | "PROD";
type UserRole = "assistant" | "residente";

interface MockUser {
  id: string;
  name: string;
  role: UserRole;
}

type UiState = {
  env: Env;
  userRole: UserRole;
  mockUser: MockUser;
};

type UiActions = {
  setEnv: (env: Env) => void;
  toggleUserRole: () => void;
  setUserRole: (role: UserRole) => void;
};

const useUiStore = create<UiState & UiActions>((set) => ({
  env: (import.meta.env.VITE_ENV as Env) || "DEV",
  userRole: "assistant",
  mockUser: {
    id: "1",
    name: "Dr. Ana López",
    role: "assistant",
  },
  setEnv: (env) => set({ env }),
  toggleUserRole: () =>
    set((state) => {
      const newRole =
        state.userRole === "assistant" ? "residente" : "assistant";
      return {
        userRole: newRole,
        mockUser: { ...state.mockUser, role: newRole },
      };
    }),
  setUserRole: (role) =>
    set((state) => ({
      userRole: role,
      mockUser: { ...state.mockUser, role },
    })),
}));

export { useUiStore };
