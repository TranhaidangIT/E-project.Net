import { useEffect, useRef } from 'react';

const AudioTerrainWave = ({ isPlaying, playerRef }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        // Animation State (Persistent across frames)
        let flowTime = 0; 
        let currentSpeed = 0.002; // Start idle
        let smoothBounce = 0;     // Smoothed beat value
        
        // Configuration
        const lineCount = 40; 
        const horizonRatio = 0.35; 
        
        // Motion Constants
        const SPEED_PLAYING = 0.035; 
        const SPEED_IDLE = 0.002;   
        const LERP_SPEED = 0.05;    // Smooth acceleration
        const LERP_BOUNCE = 0.1;    // Smooth beat reaction
        
        // Beat Config
        const BPM = 126; 
        const BEAT_INTERVAL = 60 / BPM; 

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // --- 1. SMOOTH SPEED TRANSITION ---
            const targetSpeed = isPlaying ? SPEED_PLAYING : SPEED_IDLE;
            // Lerp: current += (target - current) * factor
            currentSpeed += (targetSpeed - currentSpeed) * LERP_SPEED;
            flowTime += currentSpeed;

            // --- 2. SMOOTH BEAT CALCULATION ---
            let targetBounce = 0;
            
            if (isPlaying && playerRef?.current && typeof playerRef.current.getCurrentTime === 'function') {
                const currentTime = playerRef.current.getCurrentTime();
                
                // Sin-based Beat (0 to 1)
                // Using (sin + 1) / 2 to keep it positive and continuous
                const beatPhase = currentTime * (Math.PI * 2 / BEAT_INTERVAL);
                const rawSin = Math.sin(beatPhase);
                
                // Target bounce follows the sine wave
                targetBounce = (rawSin + 1) * 0.5; 
            }
            
            // Apply Lerp to Bounce for "organic" feel
            // If paused, targetBounce becomes 0, and we smoothly decay to flat.
            smoothBounce += (targetBounce - smoothBounce) * LERP_BOUNCE;

            const width = canvas.width;
            const height = canvas.height;
            const horizonY = height * horizonRatio;
            
            // --- 3. DRAW LINES ---
            for (let i = 0; i < lineCount; i++) {
                const t = i / lineCount; // 0 (horizon) -> 1 (bottom)
                const yBase = horizonY + t * (height - horizonY);

                // Styling
                // Taper alpha: 0.05 at top, ~0.65 at bottom
                const alpha = Math.pow(t, 2) * 0.6 + 0.05; 
                
                // Line Width: Pulse slightly with the beat
                const baseLineWidth = 0.5 + t * 2;
                const lineWidth = baseLineWidth + (t * smoothBounce * 1.5); 
                
                ctx.beginPath();
                ctx.strokeStyle = `rgba(229, 231, 235, ${alpha})`; 
                ctx.lineWidth = lineWidth;

                // Wave Calculation
                // Optimization: Step 15px for better performance
                for (let x = 0; x <= width; x += 15) { 

                    // Noise Inputs
                    // x * 0.01: Horizontal stretch
                    // flowTime: Movement
                    // i * 0.2: Separation between lines
                    const noiseX = x * 0.01;
                    const noiseY = i * 0.2;
                    
                    // Layer 1: Main Shape
                    const noise1 = Math.sin(noiseX + flowTime + noiseY);
                    // Layer 2: Detail
                    const noise2 = Math.cos(noiseX * 2.5 - flowTime * 0.5 + noiseY); // Slightly faster detail layer
                    
                    const baseNoise = noise1 + noise2; // Range ~ -2 to 2

                    // --- AMPLITUDE LOGIC ---
                    // 1. Perspective Scale (depthScale): 
                    //    Lines near bottom (t close to 1) are much taller.
                    //    Lines near horizon (t close to 0) are flat.
                    const depthScale = 45 * Math.pow(t, 1.5); 
                    
                    // 2. Beat Intensity:
                    //    Waves "breathe" (expand/contract) with smoothBounce.
                    //    Base amplitude is 0.5, adds up to 0.5 more from bounce.
                    const beatIntensity = 0.5 + (smoothBounce * 0.6);
                    
                    const amplitude = depthScale * beatIntensity;
                    
                    const yOffset = baseNoise * amplitude;
                    const y = yBase + yOffset;
                    
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw(); 

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, playerRef]);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
};

export default AudioTerrainWave;
