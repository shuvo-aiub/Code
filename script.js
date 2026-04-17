document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Solar System Background ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height, baseCenterX, baseCenterY, currentCenterX, currentCenterY;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    window.addEventListener('mousemove', (e) => { 
        mouse.x = e.clientX; 
        mouse.y = e.clientY; 
    });

    const initCanvas = () => { 
        width = canvas.width = window.innerWidth; 
        height = canvas.height = window.innerHeight; 
        baseCenterX = width / 2;
        baseCenterY = height / 2;
        currentCenterX = baseCenterX;
        currentCenterY = baseCenterY;
    };

    window.addEventListener('resize', initCanvas);
    initCanvas();

    // Generate Twinkling Stars
    const stars = [];
    for(let i = 0; i < 300; i++) {
        stars.push({
            x: Math.random() * width * 2 - width/2, // Spread wider for parallax
            y: Math.random() * height * 2 - height/2,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            twinkleSpd: 0.005 + Math.random() * 0.02
        });
    }

    // Define Planets (Distance, Size, Speed, Color)
    const planets = [
        { distance: 90, radius: 4, speed: 0.008, color: '#d35400', angle: Math.random() * Math.PI * 2 }, // Mercury
        { distance: 140, radius: 7, speed: 0.006, color: '#e67e22', angle: Math.random() * Math.PI * 2 }, // Venus
        { distance: 200, radius: 8, speed: 0.005, color: '#3498db', angle: Math.random() * Math.PI * 2 }, // Earth
        { distance: 260, radius: 6, speed: 0.004, color: '#c0392b', angle: Math.random() * Math.PI * 2 }, // Mars
        { distance: 380, radius: 16, speed: 0.002, color: '#f39c12', angle: Math.random() * Math.PI * 2 }, // Jupiter
        { distance: 500, radius: 12, speed: 0.0015, color: '#f1c40f', angle: Math.random() * Math.PI * 2, hasRing: true }, // Saturn
        { distance: 620, radius: 9, speed: 0.001, color: '#1abc9c', angle: Math.random() * Math.PI * 2 }, // Uranus
        { distance: 720, radius: 9, speed: 0.0008, color: '#2980b9', angle: Math.random() * Math.PI * 2 }  // Neptune
    ];

    const animateSolarSystem = () => {
        ctx.clearRect(0, 0, width, height);

        // Calculate Parallax Offset based on mouse position
        const targetX = baseCenterX - (mouse.x - baseCenterX) * 0.05;
        const targetY = baseCenterY - (mouse.y - baseCenterY) * 0.05;
        
        // Smooth transition for the center point
        currentCenterX += (targetX - currentCenterX) * 0.1;
        currentCenterY += (targetY - currentCenterY) * 0.1;

        // Draw Stars (with slight parallax)
        stars.forEach(star => {
            star.alpha += star.twinkleSpd;
            if(star.alpha > 1 || star.alpha < 0) star.twinkleSpd *= -1;
            
            const starX = star.x + (currentCenterX - baseCenterX) * 0.2;
            const starY = star.y + (currentCenterY - baseCenterY) * 0.2;

            ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(starX, starY, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Draw Sun
        ctx.shadowBlur = 60;
        ctx.shadowColor = '#e67e22';
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(currentCenterX, currentCenterY, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for performance

        // Draw Orbits & Planets
        planets.forEach(p => {
            p.angle += p.speed;
            const px = currentCenterX + Math.cos(p.angle) * p.distance;
            const py = currentCenterY + Math.sin(p.angle) * p.distance;

            // Draw Orbit Path
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(currentCenterX, currentCenterY, p.distance, 0, Math.PI * 2);
            ctx.stroke();

            // Draw Planet
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw Saturn's Ring
            if(p.hasRing) {
                ctx.strokeStyle = 'rgba(241, 196, 15, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                // Tilt the ring relative to the planet's orbit
                ctx.ellipse(px, py, p.radius * 2.5, p.radius * 0.6, p.angle + Math.PI/4, 0, Math.PI * 2);
                ctx.stroke();
            }
        });

        requestAnimationFrame(animateSolarSystem);
    };

    animateSolarSystem();

    // --- 2. Navigation Logic ---
    const nav = document.querySelector('.navbar');
    document.addEventListener('mousemove', (e) => {
        if (e.clientY <= 100) nav.classList.add('visible');
        else if (e.clientY > nav.getBoundingClientRect().bottom) nav.classList.remove('visible');
    });

    // --- 3. Page Switching ---
    document.querySelectorAll('.nav-links a, .btn-gradient').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if(targetId?.startsWith('#')) {
                e.preventDefault();
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                document.querySelector(targetId).classList.add('active');
                window.scrollTo(0,0);
                nav.classList.remove('visible');
            }
        });
    });

    // --- 4. 3D Tilt Effect ---
    document.querySelectorAll('.project-card, .profile-frame, .avatar-circle').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
            card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });

    // --- 5. Naruto Charging Loading Logic ---
    window.addEventListener('load', () => {
        const loader = document.getElementById('loading-screen');
        const bar = document.querySelector('.loading-bar-fill');
        const naruto = document.querySelector('.naruto-runner');
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;

            bar.style.width = `${progress}%`;
            naruto.style.left = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loader.classList.add('finished');
                }, 600);
            }
        }, 110); 
    });
});