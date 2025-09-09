export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 40"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current"
        >
            {/* Nexus Study stylized logo */}
            <g>
                {/* N shape */}
                <path d="M10 10 L10 30 L15 20 L20 30 L20 10" stroke="currentColor" strokeWidth="2" fill="none" />
                
                {/* S shape */}
                <path d="M30 15 Q30 10, 35 10 Q40 10, 40 15 Q40 20, 35 20 Q30 20, 30 25 Q30 30, 35 30 Q40 30, 40 25" 
                      stroke="currentColor" strokeWidth="2" fill="none" />
                
                {/* Dot */}
                <circle cx="50" cy="20" r="3" fill="currentColor" />
                
                {/* Global arc suggesting worldwide reach */}
                <path d="M60 10 Q80 10, 80 20 Q80 30, 60 30" 
                      stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2,2" />
            </g>
        </svg>
    );
}
