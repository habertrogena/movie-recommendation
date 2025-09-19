// Mock Firebase Auth
export const auth = {
  currentUser: { uid: "mockUid", email: "mock@example.com" },
};

export const googleProvider = {};

// Mock Firestore
export const db = {};

// Mock Firestore methods
export const collection = jest.fn();
export const doc = jest.fn();
export const getDocs = jest.fn(
  () => Promise.resolve({ docs: [] }), // default empty snapshot
);
export const setDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());

// Mock Firebase Auth methods
export const getAuth = jest.fn(() => auth);
export const signOut = jest.fn(() => Promise.resolve());
export const onAuthStateChanged = jest.fn((auth, cb) => {
  cb(auth.currentUser); // simulate immediate callback
  return jest.fn(); // return unsubscribe function
});
