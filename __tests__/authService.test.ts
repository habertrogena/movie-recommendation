import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logout,
  getCurrentUser,
} from "@/services/authService";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

// Mock firebase.ts so auth + googleProvider are fake
jest.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "123", email: "test@example.com" } },
  googleProvider: {},
}));

// Mock firebase/auth methods
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));

describe("authService", () => {
  const mockUser = { uid: "123", email: "test@example.com" } as unknown as User;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signUpWithEmail should return user on success", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    const user = await signUpWithEmail("test@example.com", "password123");

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object), // auth
      "test@example.com",
      "password123"
    );
    expect(user).toEqual(mockUser);
  });

  it("signInWithEmail should return user on success", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });

    const user = await signInWithEmail("test@example.com", "password123");

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      "test@example.com",
      "password123"
    );
    expect(user).toEqual(mockUser);
  });

  it("signInWithGoogle should return user on success", async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue({ user: mockUser });

    const user = await signInWithGoogle();

    expect(signInWithPopup).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object)
    );
    expect(user).toEqual(mockUser);
  });

  it("logout should call signOut", async () => {
    await logout();

    expect(signOut).toHaveBeenCalledWith(expect.any(Object));
  });

  it("getCurrentUser should return current user", () => {
    const user = getCurrentUser();

    expect(user).toEqual({ uid: "123", email: "test@example.com" });
  });
});
