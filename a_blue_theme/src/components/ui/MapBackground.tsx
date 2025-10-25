import { useState, useEffect } from 'react';
import { Map } from 'lucide-react';

interface MapBackgroundProps {
  hoveredArea: string | null;
  onHoverArea: (area: string | null) => void;
}

const MapBackground = ({ hoveredArea, onHoverArea }: MapBackgroundProps) => {
  // This would normally connect to a mapping library
  // For demo purposes, we're using SVG to simulate a map
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="w-full h-full bg-gray-900 relative overflow-hidden">
      {/* Base map grid */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 1000"
        style={{ filter: 'brightness(0.8) contrast(1.2)' }}
      >
        {/* Grid pattern */}
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#222" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#333" strokeWidth="1" />
          </pattern>
          
          {/* Glow effects */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Gradient for routes */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          
          {/* City/Point marker */}
          <symbol id="locationMarker" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="8" fill="#2563eb" />
            <circle cx="15" cy="15" r="4" fill="#93c5fd" />
          </symbol>
          
          {/* Delivery Point marker */}
          <symbol id="deliveryPoint" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="7" fill="#2563eb" opacity="0.7" />
            <path d="M11,15 L19,15 M15,11 L15,19" stroke="#fff" strokeWidth="2" />
          </symbol>
        </defs>
        
        {/* Background grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Geographic features - subtle continent/region outlines */}
        <path 
          d="M50,350 C150,320 250,380 350,350 C450,320 550,290 650,300 C750,310 850,280 950,330"
          fill="none" 
          stroke="#333" 
          strokeWidth="2"
          opacity="0.7" 
        />
        
        <path 
          d="M50,650 C150,680 250,650 380,690 C500,730 650,700 750,670 C850,640 900,680 950,650"
          fill="none" 
          stroke="#333" 
          strokeWidth="2"
          opacity="0.7" 
        />
        
        {/* Water bodies */}
        <ellipse cx="250" cy="500" rx="120" ry="100" fill="#172554" opacity="0.3" />
        <ellipse cx="750" cy="400" rx="150" ry="120" fill="#172554" opacity="0.3" />
        
        {/* Major roads/highways */}
        <g className="major-roads">
          {/* Curved connecting roads */}
          <path className={`${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-400`}
            d="M 250 250 C 350 350, 650 350, 750 250" 
            stroke="#444" 
            strokeWidth="2" 
            fill="none" 
          />
          <path className={`${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-500`}
            d="M 250 750 C 350 650, 650 650, 750 750" 
            stroke="#444" 
            strokeWidth="2" 
            fill="none" 
          />
        </g>
        
        {/* Active tracked routes */}
        <g className="tracked-routes">
          {/* Main route 1 */}
          <path 
            className={`${hoveredArea === 'route1' ? 'opacity-100' : 'opacity-80'} transition-opacity duration-300`}
            d="M 100 800 C 200 700, 250 650, 350 600 C 450 550, 550 500, 650 450 C 750 400, 850 350, 900 200" 
            stroke="url(#routeGradient)" 
            strokeWidth="4" 
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
            onMouseEnter={() => onHoverArea('route1')}
            onMouseLeave={() => onHoverArea(null)}
          />
          
          {/* Animation effect on route 1 */}
          <circle r="6" fill="#fff" opacity="0.8">
            <animateMotion
              path="M 100 800 C 200 700, 250 650, 350 600 C 450 550, 550 500, 650 450 C 750 400, 850 350, 900 200"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Secondary route */}
          <path 
            className={`${hoveredArea === 'route2' ? 'opacity-100' : 'opacity-60'} transition-opacity duration-300`}
            d="M 900 900 C 800 850, 700 800, 600 700 C 500 600, 400 550, 300 450 C 200 350, 150 300, 100 200" 
            stroke="#3b82f6" 
            strokeWidth="3" 
            strokeDasharray="10,5"
            strokeLinecap="round"
            fill="none"
            onMouseEnter={() => onHoverArea('route2')}
            onMouseLeave={() => onHoverArea(null)}
          />
          
          {/* Third alternate route */}
          <path 
            className={`${hoveredArea === 'route3' ? 'opacity-80' : 'opacity-40'} transition-opacity duration-300`}
            d="M 100 100 C 200 200, 300 250, 400 300 C 500 350, 600 400, 700 500 C 800 600, 900 800, 950 900" 
            stroke="#60a5fa" 
            strokeWidth="2" 
            strokeDasharray="5,5"
            strokeLinecap="round"
            fill="none"
            onMouseEnter={() => onHoverArea('route3')}
            onMouseLeave={() => onHoverArea(null)}
          />
        </g>
        
        {/* Major cities/hubs */}
        <g className="location-markers">
          {/* Origin hub */}
          <use 
            href="#locationMarker" 
            x="85" 
            y="785" 
            width="30" 
            height="30" 
            className={`${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-700`}
          />
          
          {/* Destination hub */}
          <use 
            href="#locationMarker" 
            x="885" 
            y="185" 
            width="30" 
            height="30"
            className={`${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-700`}
          />
          
          {/* Major waypoints */}
          <use 
            href="#deliveryPoint" 
            x="335" 
            y="585" 
            width="30" 
            height="30"
            className={`${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-800`}
          />
          
          <use 
            href="#deliveryPoint" 
            x="635" 
            y="435" 
            width="30" 
            height="30"
            className={`${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-900`}
          />
          
          {/* Pulse effects on major hubs */}
          <circle cx="100" cy="800" r="15" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.6">
            <animate attributeName="r" from="15" to="40" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="3s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="900" cy="200" r="15" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.6">
            <animate attributeName="r" from="15" to="40" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Map Labels - subtle */}
        <g className="map-labels" opacity="0.5">
          <text x="100" y="770" fill="#aaa" fontSize="12" textAnchor="middle">Origin</text>
          <text x="900" y="170" fill="#aaa" fontSize="12" textAnchor="middle">Destination</text>
          <text x="500" y="100" fill="#888" fontSize="14" textAnchor="middle">North Region</text>
          <text x="500" y="900" fill="#888" fontSize="14" textAnchor="middle">South Region</text>
        </g>
      </svg>
      
      {/* Optional: Add a compass/controls overlay */}
      <div className="absolute bottom-8 right-8 bg-gray-800/70 backdrop-blur-sm p-2 rounded-lg border border-gray-700">
        <Map size={24} className="text-primary" />
      </div>
    </div>
  );
};

export default MapBackground; 