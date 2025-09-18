import {
  getCurrentUser,
  logout,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/services/authService";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

jest.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "123", email: "mock@test.com" } },
  googleProvider: {},
}));

jest.mock("firebase/auth", () => {
  return {
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
    GoogleAuthProvider: jest.fn(),
    getAuth: jest.fn(() => ({
      currentUser: { uid: "123", email: "mock@test.com" },
    })),
  };
});

describe("Firebase Auth Utils", () => {
  const mockUser = { uid: "123", email: "mock@test.com" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signUpWithEmail should return a user", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
    const user = await signUpWithEmail("test@test.com", "password");
    expect(user).toEqual(mockUser);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@test.com",
      "password",
    );
  });

  it("signInWithEmail should return a user", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
    const user = await signInWithEmail("test@test.com", "password");
    expect(user).toEqual(mockUser);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@test.com",
      "password",
    );
  });

  it("signInWithGoogle should return a user", async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue({ user: mockUser });
    const user = await signInWithGoogle();
    expect(user).toEqual(mockUser);
    expect(signInWithPopup).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
    );
  });

  it("logout should call signOut", async () => {
    await logout();
    expect(signOut).toHaveBeenCalledWith(expect.anything());
  });

  it("getCurrentUser should return current user", () => {
    const user = getCurrentUser();
    expect(user).toEqual(mockUser);
  });
});
