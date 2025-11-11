import React, { useState } from 'react';
import { InsectData } from './types';
import { fetchInsectData } from './services/geminiService';
import SearchBar from './components/SearchBar';
import InsectCard from './components/InsectCard';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [insectData, setInsectData] = useState<InsectData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialState, setIsInitialState] = useState<boolean>(true);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setInsectData(null);
    setIsInitialState(false);

    try {
      const data = await fetchInsectData(query);
      setInsectData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const InitialStateDisplay = () => (
    <div className="text-center text-gray-400 p-8 animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-emerald-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7.5l-1 1-4 4-1 1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 14l-1 1-1 1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l-1.5-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 10l-1-1" />
      </svg>
      <h2 className="mt-4 text-2xl font-semibold text-gray-200">Welcome to the Insect Identifier</h2>
      <p className="mt-2 max-w-sm mx-auto">Enter the common name of an insect into the search bar to reveal its details and a generated image.</p>
    </div>
  );
  
  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative max-w-md mx-auto animate-fade-in" role="alert">
      <div className="flex">
        <div className="py-1"><svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.414 10l2.829-2.828a1 1 0 0 0-1.414-1.414L10 8.586 7.172 5.757a1 1 0 0 0-1.414 1.414L8.586 10l-2.829 2.828a1 1 0 1 0 1.414 1.414L10 11.414l2.828 2.829a1 1 0 0 0 1.414-1.414L11.414 10z"/></svg></div>
        <div>
          <p className="font-bold text-red-200">Search Failed</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <main className="w-full max-w-4xl flex flex-col items-center space-y-8 bg-black/30 backdrop-blur-md p-6 sm:p-10 rounded-2xl border border-white/10 shadow-2xl">
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 mb-2">
                Insect Identifier
            </h1>
            <p className="text-lg text-gray-300">Discover the world of insects with AI</p>
        </header>
        
        <div className="w-full max-w-lg">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="w-full flex justify-center mt-4 min-h-[300px]">
          {isLoading && <Spinner />}
          {error && <ErrorDisplay message={error} />}
          {isInitialState && <InitialStateDisplay />}
          {insectData && <InsectCard data={insectData} />}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-400 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;