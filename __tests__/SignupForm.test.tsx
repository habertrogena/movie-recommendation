import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "@/components/SignupForm";
import { signupWithEmail, loginWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";

// 🔹 Mock auth methods
jest.mock("@/lib/auth", () => ({
  signupWithEmail: jest.fn(),
  loginWithGoogle: jest.fn(),
}));

// 🔹 Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// 🔹 Suppress real alert popups
window.alert = jest.fn();

describe("SignupForm", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  });

  it("renders inputs and buttons", () => {
    render(<SignupForm />);

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Continue with Google/i }),
    ).toBeInTheDocument();
  });

  it("handles successful email signup", async () => {
    (signupWithEmail as jest.Mock).mockResolvedValue({ uid: "123" });

    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    await waitFor(() => {
      expect(signupWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
      expect(window.alert).toHaveBeenCalledWith(
        "✅ Account created successfully! Movie added to watchlist.",
      );
      expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message on email signup failure", async () => {
    (signupWithEmail as jest.Mock).mockRejectedValue(
      new Error("Signup failed"),
    );

    render(<SignupForm />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(await screen.findByText(/Signup failed/i)).toBeInTheDocument();
  });

  it("handles successful Google signup", async () => {
    (loginWithGoogle as jest.Mock).mockResolvedValue({ uid: "456" });

    render(<SignupForm />);

    fireEvent.click(
      screen.getByRole("button", { name: /Continue with Google/i }),
    );

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        "✅ Account created successfully! Movie added to watchlist.",
      );
      expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message on Google signup failure", async () => {
    (loginWithGoogle as jest.Mock).mockRejectedValue(
      new Error("Google failed"),
    );

    render(<SignupForm />);

    fireEvent.click(
      screen.getByRole("button", { name: /Continue with Google/i }),
    );

    expect(await screen.findByText(/Google failed/i)).toBeInTheDocument();
  });
});
