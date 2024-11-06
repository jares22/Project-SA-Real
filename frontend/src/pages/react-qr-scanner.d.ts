declare module 'react-qr-scanner' {
    import React from 'react';

    interface QrScannerProps {
        onError: (error: any) => void;
        onScan: (data: string | null) => void;
        facingMode?: string;
        style?: React.CSSProperties;
    }

    const QrScanner: React.FC<QrScannerProps>;

    export default QrScanner;
}
