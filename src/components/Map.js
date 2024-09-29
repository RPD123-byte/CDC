import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MapContext } from './TravelChatbot';

const Map = () => {
  const { mapHtml, locationName } = useContext(MapContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Map of {locationName}</h1>
          <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded">
            Back to Chat
          </Link>
        </div>
        <div className="w-full h-[600px] border border-gray-300 rounded">
          {mapHtml ? (
            <div dangerouslySetInnerHTML={{ __html: mapHtml }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">No map data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;