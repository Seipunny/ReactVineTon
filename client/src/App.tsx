import React, { useEffect, useState } from 'react';
import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';
import { handleTap } from './features/TapHandler';
import axios from 'axios';

function App() {
  const { address, sendIncrement } = useCounterContract();
  const { connected } = useTonConnect();
  const [count, setCount] = useState<number | null>(null); // Define count as number or null

  const fetchCount = async () => {
    if (address) {
      try {
        const response = await axios.get(`http://localhost:3000/getCount?userId=${address}`);
        setCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch count:', error);
        setCount(0); // Decide if you need to set to 0 or keep it null based on your app's logic
      }
    }
  };

  useEffect(() => {
    if (connected && address) {
      fetchCount();
    } else {
      setCount(null); // Reset count when not connected or no address
    }
  }, [address, connected]);

  const onClickTap = async () => {
    if (!connected || !address) {
      console.log("Action aborted: not connected or no address available.");
      return;
    }
    const response = await handleTap(address);
    console.log(response.message);
    setCount(prevCount => (prevCount !== null ? prevCount + 1 : 1)); // Correctly handle null and number
  };

  return (
    <div className='App'>
      <header className="App-header">
        <TonConnectButton />
        {count !== null ? <h1>Tap Count: {count}</h1> : <h1>-</h1>}
      </header>
      <div className='Container'>
        <button
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={onClickTap}
          disabled={!connected || !address}
        >
          Tap
        </button>
        <button
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={sendIncrement}
          disabled={!connected || !address}
        >
          Increment
        </button>
      </div>
    </div>
  );
}

export default App;
