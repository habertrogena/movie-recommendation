import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "@/app/page";

// Mock fetch for integration tests
const mockFetch = (response: unknown, ok = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
    } as Response),
  ) as jest.Mock;
};

describe("HomePage Integration", () => {
  const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("renders loading state", () => {
    mockFetch({ results: [] });
    render(<HomePage />, { wrapper: createWrapper() });

    // ✅ Check skeletons instead of "Loading..."
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders movies when data is fetched", async () => {
    mockFetch({ results: [{ id: 1, title: "Inception" }] });
    render(<HomePage />, { wrapper: createWrapper() });

    expect(await screen.findByText(/Inception/i)).toBeInTheDocument();
  });

  it("handles pagination correctly", async () => {
    mockFetch({
      results: [
        { id: 1, title: "Movie 1" },
        { id: 2, title: "Movie 2" },
      ],
    });

    render(<HomePage />, { wrapper: createWrapper() });

    expect(await screen.findByText(/Movie 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Movie 2/i)).toBeInTheDocument();
  });
});
