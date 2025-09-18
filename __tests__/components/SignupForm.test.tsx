import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "@/components/SignupForm";
import * as auth from "@/lib/auth";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/lib/auth", () => ({
  signupWithEmail: jest.fn(),
  loginWithGoogle: jest.fn(),
}));

// Mock window.alert
global.alert = jest.fn();

describe("SignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("signs up successfully with email", async () => {
    (auth.signupWithEmail as jest.Mock).mockResolvedValueOnce(undefined);

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(/^sign up$/i));

    // Wait for the async code inside handleEmailSignup to finish
    await waitFor(() => {
      expect(auth.signupWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "123456",
      );
      expect(global.alert).toHaveBeenCalledWith(
        "✅ Account created successfully! Movie added to watchlist.",
      );
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("signs up successfully with Google", async () => {
    (auth.loginWithGoogle as jest.Mock).mockResolvedValueOnce(undefined);

    render(<SignupForm />);
    fireEvent.click(screen.getByText(/continue with google/i));

    await waitFor(() => {
      expect(auth.loginWithGoogle).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith(
        "✅ Account created successfully! Movie added to watchlist.",
      );
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message if email signup fails with Error", async () => {
    (auth.signupWithEmail as jest.Mock).mockRejectedValueOnce(
      new Error("Email already exists"),
    );

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(/^sign up$/i));

    const errorMessage = await screen.findByText(/email already exists/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows generic error if email signup throws unknown error", async () => {
    (auth.signupWithEmail as jest.Mock).mockRejectedValueOnce(
      "some string error",
    );

    render(<SignupForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(/^sign up$/i));

    const errorMessage = await screen.findByText(
      /an unexpected error occurred/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows error message if Google signup fails with Error", async () => {
    (auth.loginWithGoogle as jest.Mock).mockRejectedValueOnce(
      new Error("Google signup failed"),
    );

    render(<SignupForm />);
    fireEvent.click(screen.getByText(/continue with google/i));

    const errorMessage = await screen.findByText(/google signup failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows generic error if Google signup throws unknown error", async () => {
    (auth.loginWithGoogle as jest.Mock).mockRejectedValueOnce("unknown");

    render(<SignupForm />);
    fireEvent.click(screen.getByText(/continue with google/i));

    const errorMessage = await screen.findByText(
      /an unexpected error occurred/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
