import React, { useRef } from 'react';
import styles from './hls-source-form.module.scss';

interface Props {
    hlsSource: string;
    setHlsSource: (hlsUrl: string) => void;
}

const HLSSourceForm = (props: Props) => {
    const { hlsSource, setHlsSource } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);

    const onClick = (e: React.FormEvent<HTMLButtonElement>) => {
        if (inputRef.current) {
            const hlsSource: string = inputRef.current.value;
            setHlsSource(hlsSource);
        }
    }

    return (
        <div className={styles.hlsSourceForm}>
            <input placeholder='Input HLS source...' ref={inputRef} />
            <button onClick={onClick}>Load</button>
        </div>
    )
}

export default HLSSourceForm;