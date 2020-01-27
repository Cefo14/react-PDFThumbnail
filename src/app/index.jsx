import React from 'react';

import PDFthumbnail from '../components/PDFthumbnail';

import './style.css';

const App = () => {
  const [url, setURL] = React.useState('https://s1.q4cdn.com/806093406/files/doc_downloads/test.pdf');
  const [alt, setAlt] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [scale, setScale] = React.useState(1);
  return (
    <div className="app">
      <input placeholder="text" value={url} type="text" onChange={(e) => setURL(e.target.value)} />
      <input placeholder="alt" value={alt} type="text" onChange={(e) => setAlt(e.target.value)} />
      <input placeholder="page" value={page} type="number" onChange={(e) => setPage(e.target.value)} />
      <input placeholder="scap" value={scale} type="number" onChange={(e) => setScale(e.target.value)} />
      <PDFthumbnail
        alt={alt}
        url={url}
        page={page}
        scale={scale}
      />
    </div>
  );
}

export default App;
