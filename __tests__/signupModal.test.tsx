import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupModal from "@/components/SignupModal";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

// 🔹 Mock Firebase auth SDK
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  updateProfile: jest.fn(),
}));

// 🔹 Mock Firebase config so auth is never initialized
jest.mock("@/lib/firebase", () => ({
  auth: {},
  googleProvider: {},
}));

// 🔹 Mock Modal to simplify rendering
jest.mock("@/components/Modal", () => ({
  __esModule: true,
  default: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => (isOpen ? <div>{children}</div> : null),
}));

describe("SignupModal", () => {
  const onClose = jest.fn();
  const onSignedUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields when open", () => {
    render(
      <SignupModal isOpen={true} onClose={onClose} onSignedUp={onSignedUp} />,
    );

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  it("handles email signup success", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "123", displayName: null },
    });

    render(
      <SignupModal isOpen={true} onClose={onClose} onSignedUp={onSignedUp} />,
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create account/i }));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object), // auth mock
        "test@example.com",
        "password123",
      );
      expect(updateProfile).toHaveBeenCalledWith(
        { uid: "123", displayName: null },
        { displayName: "testuser" },
      );
      expect(onSignedUp).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("handles email signup error", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error("Signup failed"),
    );

    render(
      <SignupModal isOpen={true} onClose={onClose} onSignedUp={onSignedUp} />,
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create account/i }));
  });

  it("handles Google signup success", async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: { uid: "456", displayName: "Google User" },
    });

    render(
      <SignupModal isOpen={true} onClose={onClose} onSignedUp={onSignedUp} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Continue with Google/i }),
    );

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(onSignedUp).toHaveBeenCalledWith({
        uid: "456",
        displayName: "Google User",
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("handles Google signup error", async () => {
    (signInWithPopup as jest.Mock).mockRejectedValue(new Error("Google error"));

    render(
      <SignupModal isOpen={true} onClose={onClose} onSignedUp={onSignedUp} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Continue with Google/i }),
    );

    expect(await screen.findByText(/Google error/i)).toBeInTheDocument();
  });

  it("shows busy state while signing up", async () => {
    let resolveSignup: Function;
    (createUserWithEmailAndPassword as jest.Mock).mockReturnValue(
      new Promise((res) => (resolveSignup = res)),
    );

    render(
      <SignupModal isOpen={true} onClose={onClose} onSignedUp={onSignedUp} />,
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "busy@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create account/i }));

    // resolve signup
    resolveSignup!({ user: { uid: "999" } });
  });
});
