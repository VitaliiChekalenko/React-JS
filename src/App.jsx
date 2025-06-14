
import { useState } from 'react';

const symbols = ['🍒', '🍋', '🍊', '🔔', '⭐', '💎'];

function App() {
  const [grid, setGrid] = useState(generateGrid());
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(10);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [winCells, setWinCells] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  function generateGrid() {
    return Array(3).fill().map(() =>
      Array(3).fill().map(() =>
        symbols[Math.floor(Math.random() * symbols.length)]
      )
    );
  }

  const spin = () => {
    if (spinning) return;

    if (balance < bet) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    setSpinning(true);
    setBalance(prev => prev - bet);
    setWinCells([]);

    let steps = 10;
    const interval = setInterval(() => {
      setGrid(generateGrid());
      steps--;
      if (steps === 0) {
        clearInterval(interval);
        const finalGrid = generateGrid();
        setGrid(finalGrid);
        setSpinning(false);

        const result = checkWin(finalGrid);
        if (result.win) {
          const prize = bet * 5;
          setBalance(prev => prev + prize);
          setWinCells(result.cells);
          const winSound = new Audio(import.meta.env.BASE_URL + '/sounds/win.mp3');
          winSound.play().catch(() => {});
        }
      }
    }, 100);
  };

  const checkWin = (grid) => {
    const winning = [];

    // Horizontal lines only
    for (let i = 0; i < 3; i++) {
      if (grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
        winning.push([i, 0], [i, 1], [i, 2]);
      }
    }

    // Diagonal lines
    if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
      winning.push([0, 0], [1, 1], [2, 2]);
    }
    if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
      winning.push([0, 2], [1, 1], [2, 0]);
    }

    return { win: winning.length > 0, cells: winning };
  };

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (!isNaN(amount) && amount > 0) {
      setBalance(prev => prev + amount);
      setTopUpAmount('');
    }
  };

  const isWinningCell = (i, j) => winCells.some(([x, y]) => x === i && y === j);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px', position: 'relative', minHeight: '100vh' }}>
      <h1>🎰 3x3 Slot Machine</h1>
      <p>💰 Balance: ${balance}</p>
      <p>🎯 Bet: ${bet}</p>

      <div style={{ display: 'inline-block', margin: '20px auto' }}>
        {grid.map((row, i) => (
          <div key={i} style={{ display: 'flex' }}>
            {row.map((symbol, j) => (
              <div key={j} style={{
                fontSize: '50px',
                border: '2px solid #444',
                borderRadius: '10px',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '5px',
                backgroundColor: isWinningCell(i, j) ? '#ffd700' : '#f0f0f0',
                animation: spinning ? 'spin 0.3s linear infinite' : 'none'
              }}>
                {symbol}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div>
        <button onClick={spin} disabled={spinning} style={{
          padding: '10px 20px',
          fontSize: '20px',
          cursor: spinning ? 'not-allowed' : 'pointer',
          borderRadius: '10px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          marginTop: '20px'
        }}>
          {spinning ? 'Spinning...' : 'Spin'}
        </button>
      </div>

      {showAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ff4d4f',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '16px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        }}>
          Not enough balance! Please top up.
        </div>
      )}

      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#ffffffcc',
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Top-up amount"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            style={{
              padding: '6px',
              fontSize: '14px',
              width: '100px',
              marginRight: '8px',
              border: showAlert ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button onClick={handleTopUp} style={{
            padding: '6px 12px',
            fontSize: '14px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer'
          }}>
            Top Up
          </button>
        </div>
        <div>
          <label style={{ marginRight: '8px' }}>Set Bet:</label>
          <input
            type="number"
            min="1"
            value={bet}
            onChange={(e) => setBet(Math.max(1, parseInt(e.target.value)))}
            style={{
              padding: '6px',
              fontSize: '14px',
              width: '60px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      <style>
        {`@keyframes spin {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(360deg); }
        }`}
      </style>
    </div>
  );
}

export default App;
