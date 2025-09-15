import { addMovieToWatchlist } from "@/services/watchlistService";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Mock firebase.ts so getFirestore() never runs
jest.mock("@/lib/firebase", () => ({
  db: {}, // fake db object
}));

// Mock Firestore methods
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

describe("watchlistService", () => {
  const mockUid = "user123";
  const mockMovie = { id: 42, title: "Inception" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls Firestore with correct document path and data", async () => {
    const mockDocRef = { path: "mock/path" };
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (serverTimestamp as jest.Mock).mockReturnValue("mock-timestamp");

    await addMovieToWatchlist(mockUid, mockMovie);

    expect(doc).toHaveBeenCalledWith(
      {},
      "users",
      mockUid,
      "watchlist",
      String(mockMovie.id),
    );
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      movieId: mockMovie.id,
      title: mockMovie.title,
      addedAt: "mock-timestamp",
    });
  });

  it("throws if Firestore setDoc fails", async () => {
    (doc as jest.Mock).mockReturnValue({});
    (setDoc as jest.Mock).mockRejectedValue(new Error("Firestore error"));

    await expect(addMovieToWatchlist(mockUid, mockMovie)).rejects.toThrow(
      "Firestore error",
    );
  });
});
