import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import './App.css';

const headers = [
  { label: 'Wallet Address', key: 'walletAddress' },
  { label: 'User', key: 'user' },
];

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const csvReportProps = {
    data: messages,
    headers: headers,
    filename: 'addresses.csv',
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios('/api/getWalletAddresses');
      setMessages(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="App">
      {loading ? (
        'Loading...'
      ) : (
        <CSVLink {...csvReportProps} style={{ fontSize: '18px' }}>
          Export to CSV
        </CSVLink>
      )}
    </div>
  );
}

export default App;
