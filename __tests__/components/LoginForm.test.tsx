import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/LoginForm";
import * as auth from "@/lib/auth";

// Mock next/router
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock auth functions
jest.mock("@/lib/auth", () => ({
  loginWithEmail: jest.fn(),
  loginWithGoogle: jest.fn(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs in successfully with email", async () => {
    (auth.loginWithEmail as jest.Mock).mockResolvedValueOnce(undefined);

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(/^login$/i));

    // Wait for router push
    await screen.findByText(/login/i);
    expect(auth.loginWithEmail).toHaveBeenCalledWith(
      "test@example.com",
      "123456",
    );
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows error message if email login fails with Error", async () => {
    (auth.loginWithEmail as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials"),
    );

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(/^login$/i));

    const errorMessage = await screen.findByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows generic error if email login throws unknown error", async () => {
    (auth.loginWithEmail as jest.Mock).mockRejectedValueOnce(
      "some string error",
    );

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(/^login$/i));

    const errorMessage = await screen.findByText(
      /an unexpected error occurred/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("logs in successfully with Google", async () => {
    (auth.loginWithGoogle as jest.Mock).mockResolvedValueOnce(undefined);

    render(<LoginForm />);
    fireEvent.click(screen.getByText(/continue with google/i));

    await screen.findByText(/continue with google/i);
    expect(auth.loginWithGoogle).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows error message if Google login fails with Error", async () => {
    (auth.loginWithGoogle as jest.Mock).mockRejectedValueOnce(
      new Error("Google login failed"),
    );

    render(<LoginForm />);
    fireEvent.click(screen.getByText(/continue with google/i));

    const errorMessage = await screen.findByText(/google login failed/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows generic error if Google login throws unknown error", async () => {
    (auth.loginWithGoogle as jest.Mock).mockRejectedValueOnce(
      "some string error",
    );

    render(<LoginForm />);
    fireEvent.click(screen.getByText(/continue with google/i));

    const errorMessage = await screen.findByText(
      /an unexpected error occurred/i,
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
