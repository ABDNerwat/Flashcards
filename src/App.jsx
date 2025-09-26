import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Auth from './components/Auth';
import FlashcardPage from './components/FlashcardPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); setLoading(false); }); return () => unsubscribe(); }, []);
  const handleLogout = () => signOut(auth);
  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">🧠 Flashcard App</h1>
        {user && <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout</button>}
      </nav>
      <main className="container mx-auto p-4">
        {user ? <FlashcardPage user={user} /> : <Auth />}
      </main>
    </div>
  );
}
export default App;