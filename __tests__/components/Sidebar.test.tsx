import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/Sidebar";
import { getUserCategories } from "@/services/categoryService";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/lib/firebase", () => ({
  auth: { currentUser: { uid: "mock-uid" } },
  googleProvider: {},
  db: {},
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { uid: "mock-uid", email: "test@example.com" },
    logout: jest.fn(),
  }),
}));

jest.mock("@/services/categoryService", () => ({
  getUserCategories: jest.fn(),
}));

// Utility function to render with QueryClientProvider
const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("Sidebar", () => {
  beforeEach(() => {
    (getUserCategories as jest.Mock).mockReset();
  });

  it("renders and loads categories without act warnings", async () => {
    (getUserCategories as jest.Mock).mockResolvedValue([
      { id: "1", name: "Mock Cat", count: 3 },
    ]);

    renderWithQueryClient(<Sidebar />);

    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // After async load
    await waitFor(() => {
      expect(screen.getByText("Mock Cat")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("shows 'No categories yet' if API returns empty", async () => {
    (getUserCategories as jest.Mock).mockResolvedValue([]);

    renderWithQueryClient(<Sidebar />);

    await waitFor(() => {
      expect(screen.getByText(/No categories yet/i)).toBeInTheDocument();
    });
  });
});
