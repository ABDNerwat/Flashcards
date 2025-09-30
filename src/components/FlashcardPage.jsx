import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import EditModal from './EditModal'; // Make sure you have this component

// --- Flashcard Sub-Component ---
// Renders a single, flippable flashcard with edit and delete buttons.
const Flashcard = ({ card, onDelete, onEdit }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="group h-64 [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* Card Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-white shadow-lg rounded-lg flex items-center justify-center p-4">
          <h2 className="text-3xl font-bold text-center">{card.word}</h2>
        </div>
        
        {/* Card Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-blue-500 text-white shadow-lg rounded-lg flex flex-col items-center justify-center p-4 [transform:rotateY(180deg)]">
          <div className="absolute top-2 right-2 flex space-x-2">
            <button onClick={(e) => { e.stopPropagation(); onEdit(card); }} className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-sm" title="Edit">✏️</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(card.id); }} className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-sm" title="Delete">🗑️</button>
          </div>
          
          <div className="w-full h-full overflow-y-auto pt-8">
            <p className="text-lg text-center">{card.meaning}</p>
            <p className="mt-4 italic text-center text-sm">"{card.usage}"</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};
// --- Main Page Component ---
// Manages all state and logic for the flashcard page.
const FlashcardPage = ({ user }) => {
  // --- State Management ---
  const [cards, setCards] = useState([]); // Master list of cards from Firebase
  const [displayedCards, setDisplayedCards] = useState([]); // Sorted/filtered list for display
  const [sortOrder, setSortOrder] = useState('date'); // 'date', 'alpha', or 'random'

  // Form state for creating new cards
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [usage, setUsage] = useState('');

  // State for the edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);

  // --- Data Fetching and Sorting ---

  // 1. Fetches the master list of cards from Firestore, ordered by creation date.
  useEffect(() => {
    const q = query(
      collection(db, 'flashcards'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cardsData);
    });
    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [user.uid]);

  // 2. Applies sorting whenever the master list or sort order changes.
  useEffect(() => {
    let sortedCards = [...cards];
    if (sortOrder === 'alpha') {
      sortedCards.sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortOrder === 'random') {
      sortedCards.sort(() => Math.random() - 0.5);
    }
    // For 'date', the default order from Firestore is already correct.
    setDisplayedCards(sortedCards);
  }, [cards, sortOrder]);

  // --- Handler Functions ---

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!word || !meaning || !usage) return;
    await addDoc(collection(db, 'flashcards'), {
      word,
      meaning,
      usage,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });
    setWord('');
    setMeaning('');
    setUsage('');
  };

  const handleDeleteCard = async (id) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      await deleteDoc(doc(db, 'flashcards', id));
    }
  };

  const handleEditClick = (card) => {
    setCurrentCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCard(null);
  };

  const handleSaveEdit = async (id, updatedData) => {
    const cardDoc = doc(db, 'flashcards', id);
    await updateDoc(cardDoc, updatedData);
    handleCloseModal();
  };

  // --- JSX Rendering ---

  return (
    <div>
      <EditModal
        card={currentCard}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
      />

      <form onSubmit={handleAddCard} className="mb-8 p-6 bg-white rounded-lg shadow-md space-y-3">
        <h3 className="text-xl font-semibold">Create New Flashcard</h3>
        <input
          value={word}
          onChange={e => setWord(e.target.value)}
          placeholder="Word"
          className="w-full p-2 border rounded"
        />
        <input
          value={meaning}
          onChange={e => setMeaning(e.target.value)}
          placeholder="Meaning"
          className="w-full p-2 border rounded"
        />
        <input
          value={usage}
          onChange={e => setUsage(e.target.value)}
          placeholder="Usage in a sentence"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Add Card
        </button>
      </form>

      <div className="mb-4 flex justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded-md shadow-sm"
        >
          <option value="date">Sort by Date Added</option>
          <option value="alpha">Sort Alphabetically</option>
          <option value="random">Sort Randomly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedCards.map(card => (
          <Flashcard
            key={card.id}
            card={card}
            onDelete={handleDeleteCard}
            onEdit={handleEditClick}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashcardPage;