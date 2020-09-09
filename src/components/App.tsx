import React, { useState } from 'react';
import styles from './App.module.scss';
import HLSAudioPlayer from './hls-audio-player/hls-audio-player';
import HLSSourceForm from './hls-source-form/hls-source-form';

const App = () => {
  const [hlsSource, setHlsSource] = useState('');
  
  return (
    <div className={styles.app}>
      <div className={styles.formWrapper}>
        <HLSSourceForm hlsSource={hlsSource} setHlsSource={setHlsSource} />
      </div>
      <div className={styles.playerWrapper}>
        <HLSAudioPlayer hlsSource={hlsSource} />
      </div>
    </div>
  );
}

export default App;
