import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  const handleAuth = async (e) => { e.preventDefault(); try { if (isSignUp) { await createUserWithEmailAndPassword(auth, email, password); } else { await signInWithEmailAndPassword(auth, email, password); } } catch (error) { alert(error.message); } };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 border rounded-md" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 border rounded-md" required />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">{isSignUp ? 'Sign Up' : 'Log In'}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-center w-full text-sm text-blue-500 hover:underline">
        {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
};
export default Auth;