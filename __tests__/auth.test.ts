import {
  loginWithGoogle,
  loginWithEmail,
  signupWithEmail,
  logout,
} from "@/lib/auth"; // adjust path if needed

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Mock firebase.ts (auth instance)
jest.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "123", email: "test@example.com" } },
}));

// Mock firebase/auth methods
jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

describe("auth wrapper", () => {
  const mockUserCredential = {
    user: { uid: "123", email: "test@example.com" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loginWithGoogle calls signInWithPopup with auth and GoogleAuthProvider", async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue(mockUserCredential);

    const result = await loginWithGoogle();

    expect(signInWithPopup).toHaveBeenCalledWith(
      expect.any(Object), // auth
      expect.any(GoogleAuthProvider)
    );
    expect(result).toEqual(mockUserCredential);
  });

  it("loginWithEmail calls signInWithEmailAndPassword", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(
      mockUserCredential
    );

    const result = await loginWithEmail("test@example.com", "password123");

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      "test@example.com",
      "password123"
    );
    expect(result).toEqual(mockUserCredential);
  });

  it("signupWithEmail calls createUserWithEmailAndPassword", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
      mockUserCredential
    );

    const result = await signupWithEmail("new@example.com", "password456");

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      "new@example.com",
      "password456"
    );
    expect(result).toEqual(mockUserCredential);
  });

  it("logout calls signOut", async () => {
    (signOut as jest.Mock).mockResolvedValue(undefined);

    await logout();

    expect(signOut).toHaveBeenCalledWith(expect.any(Object));
  });
});
