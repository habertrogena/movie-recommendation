import { render, screen, waitFor } from "@testing-library/react";
import Sidebar from "@/components/dashboard/Sidebar";

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
  getUserCategories: jest
    .fn()
    .mockResolvedValue([{ id: "1", name: "Mock Cat", count: 3 }]),
}));

describe("Sidebar", () => {
  it("renders and loads categories without act warnings", async () => {
    render(<Sidebar />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mock Cat")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("shows 'No categories yet' if API returns empty", async () => {
    const { getUserCategories } = require("@/services/categoryService");
    getUserCategories.mockResolvedValueOnce([]);

    render(<Sidebar />);
  });
});
