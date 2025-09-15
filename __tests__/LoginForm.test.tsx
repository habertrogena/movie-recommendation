import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/components/LoginForm";
import { loginWithEmail, loginWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";

// Mock auth functions
jest.mock("@/lib/auth", () => ({
  loginWithEmail: jest.fn(),
  loginWithGoogle: jest.fn(),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginForm", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("renders the form inputs and buttons", () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue with google/i }),
    ).toBeInTheDocument();
  });

  it("calls loginWithEmail and redirects on success", async () => {
    (loginWithEmail as jest.Mock).mockResolvedValueOnce({});

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(loginWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message if loginWithEmail fails", async () => {
    (loginWithEmail as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials"),
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("calls loginWithGoogle and redirects on success", async () => {
    (loginWithGoogle as jest.Mock).mockResolvedValueOnce({});

    render(<LoginForm />);
    fireEvent.click(
      screen.getByRole("button", { name: /continue with google/i }),
    );

    await waitFor(() => {
      expect(loginWithGoogle).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error if loginWithGoogle fails", async () => {
    (loginWithGoogle as jest.Mock).mockRejectedValueOnce(
      new Error("Google login failed"),
    );

    render(<LoginForm />);
    fireEvent.click(
      screen.getByRole("button", { name: /continue with google/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/google login failed/i)).toBeInTheDocument();
    });
  });
});
