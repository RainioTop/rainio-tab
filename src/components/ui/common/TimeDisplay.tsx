import React from 'react';
import Counter from '@/components/ui/reactbits/Counter';
import './TimeDisplay.css';

interface TimeDisplayProps {
    hours: number;
    minutes: number;
    seconds: number;
    clockFontSize: number;
    clockSplitFontSize: number;
    clockDivFontSize: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
                                                     hours,
                                                     minutes,
                                                     seconds,
                                                     clockFontSize,
                                                     clockSplitFontSize,
                                                     clockDivFontSize
                                                 }) => {
    return (
        <div className="time-display" style={{ bottom: clockDivFontSize }}>
            <Counter
                value={hours}
                places={[10, 1]}
                fontSize={clockFontSize}
                padding={0}
                gap={0}
                textColor="white"
                fontWeight={900}
                gradientHeight={0}
            />
            <span style={{ fontSize: clockSplitFontSize, color: 'white', fontWeight: 900 }}>:</span>
            <Counter
                value={minutes}
                places={[10, 1]}
                fontSize={clockFontSize}
                padding={0}
                gap={0}
                textColor="white"
                fontWeight={900}
                gradientHeight={0}
            />
            <span style={{ fontSize: clockSplitFontSize, color: 'white', fontWeight: 900 }}>:</span>
            <Counter
                value={seconds}
                places={[10, 1]}
                fontSize={clockFontSize}
                padding={0}
                gap={0}
                textColor="white"
                fontWeight={900}
                gradientHeight={0}
            />
        </div>
    );
};

export default TimeDisplay;