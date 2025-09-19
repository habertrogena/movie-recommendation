import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { useAuth } from "../../hooks/useAuth";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../lib/firebase";

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("../../lib/firebase", () => ({
  auth: {},
}));

describe("useAuth hook", () => {
  const mockUser: Partial<User> = { uid: "123", email: "mock@test.com" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set user on auth state change", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn(); // unsubscribe
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.loading).toBe(false);
    });
  });

  it("logout should call signOut and clear user", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    (signOut as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      const success = await result.current.logout();
      expect(success).toBe(true);
    });

    expect(signOut).toHaveBeenCalledWith(auth);
    expect(result.current.user).toBe(null);
  });

  it("logout should return false if signOut fails", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth());

    (signOut as jest.Mock).mockRejectedValue(new Error("Failed"));

    await act(async () => {
      const success = await result.current.logout();
      expect(success).toBe(false);
    });

    expect(signOut).toHaveBeenCalledWith(auth);
    expect(result.current.user).toEqual(mockUser);
  });
});
