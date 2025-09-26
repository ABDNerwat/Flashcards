import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const Flashcard = ({ card, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="group h-64 [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-white shadow-lg rounded-lg flex items-center justify-center p-4">
          <h2 className="text-3xl font-bold text-center">{card.word}</h2>
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-blue-500 text-white shadow-lg rounded-lg flex flex-col items-center justify-center p-4 [transform:rotateY(180deg)]">
          <p className="text-lg">{card.meaning}</p>
          <p className="mt-4 italic text-sm">"{card.usage}"</p>
          <button onClick={(e) => { e.stopPropagation(); onDelete(card.id); }} className="absolute bottom-4 right-4 bg-red-500 p-2 rounded-full hover:bg-red-600">🗑️</button>
        </div>
      </div>
    </div>
  );
};

const FlashcardPage = ({ user }) => {
  const [cards, setCards] = useState([]);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [usage, setUsage] = useState('');

  useEffect(() => { const q = query(collection(db, 'flashcards'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')); const unsubscribe = onSnapshot(q, (snapshot) => { setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); }); return () => unsubscribe(); }, [user.uid]);
  const handleAddCard = async (e) => { e.preventDefault(); if (!word || !meaning || !usage) return; await addDoc(collection(db, 'flashcards'), { word, meaning, usage, userId: user.uid, createdAt: serverTimestamp() }); setWord(''); setMeaning(''); setUsage(''); };
  const handleDeleteCard = async (id) => { if (window.confirm("Delete this card?")) await deleteDoc(doc(db, 'flashcards', id)); };

  return (
    <div>
      <form onSubmit={handleAddCard} className="mb-8 p-6 bg-white rounded-lg shadow-md space-y-3">
        <h3 className="text-xl font-semibold">Create New Flashcard</h3>
        <input value={word} onChange={e => setWord(e.target.value)} placeholder="Word" className="w-full p-2 border rounded" />
        <input value={meaning} onChange={e => setMeaning(e.target.value)} placeholder="Meaning" className="w-full p-2 border rounded" />
        <input value={usage} onChange={e => setUsage(e.target.value)} placeholder="Usage" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Add Card</button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map(card => <Flashcard key={card.id} card={card} onDelete={handleDeleteCard} />)}
      </div>
    </div>
  );
};
export default FlashcardPage;