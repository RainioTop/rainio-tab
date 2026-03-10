import React from 'react';
import TextType from '@/components/ui/reactbits/TextType';
import './QuoteText.css';

interface QuoteTextProps {
    text: string[];
    fontSize: number;
    textAlign: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end' | 'inherit';
}

const QuoteText: React.FC<QuoteTextProps> = ({
                                                 text,
                                                 fontSize,
                                                 textAlign
                                             }) => {
    return (
        <TextType
            className="quote-text"
            text={text}
            showCursor={true}
            hideCursorWhileTyping={true}
            cursorCharacter={"▎"}
            loop={false}
            variableSpeed={{ min: 50, max: 350 }}
            style={{
                fontSize: fontSize,
                textAlign: textAlign
            }}
        />
    );
};

export default QuoteText;