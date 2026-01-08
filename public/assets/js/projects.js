
// Execute project animation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsAnimation);
} else {
    initProjectsAnimation();
}

function initProjectsAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.projects-section');
    const liftContainer = document.querySelector('.image-lift-container');
    const projectDetails = document.querySelectorAll('.project-details');
    // const roomDepth = document.querySelector('.room-depth'); 

    // Total projects
    const totalProjects = projectDetails.length;

    // Initial State: Show first project
    if (totalProjects > 0) {
        gsap.set(projectDetails[0], { autoAlpha: 1, y: 0 });
    }

    // Main Timeline
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=3000",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    });

    // 1. Lift Animation
    // We move the lift container UP.
    // Assuming standard flex column (1, 2, 3) 
    // At start: 1 is visible. 2 is below. 3 is further below.
    // NOTE: parent .back-wall-window has overflow hidden.
    // If 1 is visible, and 2 is below, we must move the container UP (negative Y) to show 2.
    // Total movement: 0% -> -100% (shows 2) -> -200% (shows 3).
    // So target is -(totalProjects - 1) * 100 + "%"

    tl.to(liftContainer, {
        yPercent: -(totalProjects - 1) * 100,
        ease: "none",
        duration: totalProjects - 1
    }, 0); // Start at 0 absolute time

    // 2. Text Animations
    // Duration of entire timeline matches totalProjects-1 (e.g. 2s for 3 projects)
    // Shift occurs between Time X and Time X+1.
    // We want text to switch roughly halfway or synced with the lift.

    projectDetails.forEach((detail, index) => {
        if (index === 0) return; // Project 1 handled initially

        const prevDetail = projectDetails[index - 1];

        // Timeline Time: "index - 1" is when we start moving FROM prev TO current.
        // e.g. Index 1 (Proj 2). Move starts at 0. Ends at 1.

        // Define overlap for smoother transition
        const startTime = (index - 1) + 0.2; // Start fading out prev a bit INTO the move
        const switchTime = (index - 1) + 0.5; // New text comes in halfway

        // Fade OUT Previous
        tl.to(prevDetail, {
            autoAlpha: 0,
            y: -20, // Slide up
            duration: 0.3
        }, startTime);

        // Fade IN Current
        tl.fromTo(detail, {
            autoAlpha: 0,
            y: 20
        }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.3
        }, switchTime);
    });

    // 4. Parallax Effect (Removed as 3D Room is gone)
    // section.addEventListener('mousemove', ...);
}
