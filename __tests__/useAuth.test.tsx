// __tests__/useAuth.test.tsx
import { renderHook, act } from "@testing-library/react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

// Mock lib/firebase to avoid calling real Firebase
jest.mock("@/lib/firebase", () => ({
  auth: {}, // dummy object
}));

// Mock firebase/auth methods
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

import { useAuth } from "@/hooks/useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets user when authenticated", () => {
    const mockUser = { uid: "123", email: "test@example.com" } as User;

    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(mockUser); // simulate login
      return jest.fn(); // unsubscribe
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it("sets user as null when not authenticated", () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback(null); // simulate logout
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("logs out user when logout is called", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
      callback({ uid: "123" } as User);
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });
});
