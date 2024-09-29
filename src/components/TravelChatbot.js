import React, { useState, createContext, useCallback} from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Map from './Map';

const Send = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const Plane = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
  </svg>
);

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow ${className}`} {...props}>{children}</div>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>{children}</div>
);

const Button = ({ children, className, ...props }) => (
    <button className={`px-6 py-3 bg-blue-500 text-white rounded text-lg font-semibold flex items-center justify-center ${className}`} {...props}>
      {children}
    </button>
  );

const Input = ({ className, ...props }) => (
  <input className={`border rounded px-2 py-1 ${className}`} {...props} />
);

// This func generated with AI
const formatMessage = (content) => {
  const lines = content.split('\n');
  
  return lines.map((line, index) => {
    if (/^\d+\./.test(line)) {
      return <p key={index} className="font-bold mt-2">{line}</p>;
    }
    if (line.includes('**')) {
      return (
        <p key={index} className="ml-4">
          {line.split('**').map((part, i) => 
            i % 2 === 0 ? part : <strong key={i}>{part}</strong>
          )}
        </p>
      );
    }
    return <p key={index} className="ml-4">{line}</p>;
  });
};

export const MapContext = createContext();

const ChatInterface = ({ messages, isLoading, input, setInput, handleSubmit, mapHtml, locationName }) => {
  const navigate = useNavigate();

  const formatMessageWithLink = useCallback((content) => {
    if (!mapHtml || !locationName) return content;

    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      if (/^\d+\./.test(line)) {
        return <p key={index} className="font-bold mt-2">{line}</p>;
      }

      const parts = line.split(new RegExp(`(${locationName})`, 'gi'));
      return (
        <p key={index} className="ml-4">
          {parts.map((part, i) => 
            part.toLowerCase() === locationName.toLowerCase() ? (
              <span 
                key={i}
                className="text-blue-500 underline cursor-pointer"
                onClick={() => navigate('/map')}
              >
                {part}
              </span>
            ) : part
          )}
        </p>
      );
    });
  }, [mapHtml, locationName, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-6">
            <Plane className="text-blue-500 mr-2" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Travel Chatbot</h1>
          </div>
          <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg ${
                  msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {msg.type === 'user' ? msg.content : formatMessageWithLink(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center">
                <span className="inline-block p-2 bg-gray-200 rounded-lg">Thinking...</span>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your travel plans..."
              className="flex-grow text-lg p-3"
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="mr-2" size={24} />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const TravelChatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapHtml, setMapHtml] = useState(null);
  const [locationName, setLocationName] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: input }]);

    try {
      const response = await fetch('https://4812-2607-ec80-c00-217a-6d-f8e8-50ad-599a.ngrok-free.app/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
      if (data.map_html) {
        setMapHtml(data.map_html);
        setLocationName(data.location_name);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'bot', content: "Sorry, I couldn't process your request." }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  }, [input]);

  return (
    <MapContext.Provider value={{ mapHtml, locationName }}>
      <Router>
        <Routes>
          <Route path="/" element={
            <ChatInterface 
              messages={messages}
              isLoading={isLoading}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              mapHtml={mapHtml}
              locationName={locationName}
            />
          } />
          <Route path="/map" element={<Map />} />
        </Routes>
      </Router>
    </MapContext.Provider>
  );
};

export default TravelChatbot;