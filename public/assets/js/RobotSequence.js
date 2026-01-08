const canvas = document.getElementById("robot-canvas");
const context = canvas.getContext("2d");


const frameCount = 93;
const currentFrame = index => (
    `./assets/robot_seq/robot-full_${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const robot = {
    frame: 0
};

// Preload images
let imagesLoaded = 0;
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 1) {
            render(); // Render first frame as soon as it's ready
        }
    };
    img.src = currentFrame(i);
    images.push(img);
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const img = images[Math.round(robot.frame)];
    if (img && img.complete) {
        // Calculate scale to fill (cover)
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
}

// GSAP Scroll Animation for Frames
gsap.to(robot, {
    frame: frameCount - 1,
    ease: "none",
    scrollTrigger: {
        trigger: "#section-3",
        start: "top top",
        end: "+=3000", // Makes the scroll last longer (3000px)
        scrub: 1,
        pin: true, // Pins the section so it stays in view while animating
    },
    onUpdate: render
});




// Set initial size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}

window.addEventListener('resize', resize);
resize();

