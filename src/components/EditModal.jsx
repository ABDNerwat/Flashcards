import React, { useState, useEffect } from 'react';

// The Modal component receives the card to edit, open/close state, and save/close functions
function EditModal({ card, isOpen, onClose, onSave }) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [usage, setUsage] = useState('');

  // When the 'card' prop changes, update the form's state
  useEffect(() => {
    if (card) {
      setWord(card.word);
      setMeaning(card.meaning);
      setUsage(card.usage);
    }
  }, [card]);

  const handleSave = () => {
    // Create an object with the updated data
    const updatedCard = { word, meaning, usage };
    onSave(card.id, updatedCard);
  };

  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
  }

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Flashcard</h2>
        <div className="space-y-4">
          <input type="text" value={word} onChange={(e) => setWord(e.target.value)} placeholder="Word" className="w-full p-2 border rounded" />
          <input type="text" value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Meaning" className="w-full p-2 border rounded" />
          <input type="text" value={usage} onChange={(e) => setUsage(e.target.value)} placeholder="Usage" className="w-full p-2 border rounded" />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;