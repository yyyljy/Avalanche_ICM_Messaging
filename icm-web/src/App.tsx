import { WalletProvider } from './contexts/WalletContext';
import { ChristmasMessageForm } from './components/ChristmasMessageForm';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <div className="app">
        <div className="snowflakes" aria-hidden="true">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="snowflake">❅</div>
          ))}
        </div>

        <header className="header">
          <h1>🎄 Merry AVAX-MAS: Build & Wish 🎄</h1>
          <p className="subtitle">Powered by Team 1 Korea</p>
        </header>

        <main className="main">
          <div className="container">
            <ChristmasMessageForm />
          </div>
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;
