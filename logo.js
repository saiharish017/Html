document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".console_sticky-section");

    gsap.registerPlugin(ScrollTrigger);

    const breakpoints = {
        desktop: 992,
        tablet: 768,
        largeMobile: 480,
        smallMobile: 0,
    };

    function getBreakpoint() {
        const width = window.innerWidth;
        if (width >= breakpoints.desktop) return "desktop";
        if (width >= breakpoints.tablet) return "tablet";
        if (width >= breakpoints.largeMobile) return "large-mobile";
        return "small-mobile";
    }

   unction initTypingAnimation(container) {
    const textTarget = container.querySelector(".text-animation");
    const hiddenContent = container.querySelector(".text-animation-hidden");
    if (!textTarget || !hiddenContent) return null;

    clearContainer(textTarget); // Clear any existing content

    let asciiBoxLines = hiddenContent.textContent
        .split('\n')
        .map(line => line.trim()); // Trim both left and right for each line

    const maxLineLength = Math.max(...asciiBoxLines.map(line => line.length));

    // Optional: Align all lines to the same length by padding if needed
    asciiBoxLines = asciiBoxLines.map(line =>
        line.padEnd(maxLineLength, ' ') // Ensure uniform line length without trailing spaces
    );

    let lineIndex = 0;
    let charIndex = 0;
    let animationActive = true; // Control flag for stopping the animation
    let timeoutId = null;

    const totalChars = asciiBoxLines.join('\n').length;
    const totalDuration = 1500; // Total animation duration in ms
    const delay = totalDuration / totalChars;

    function typeLine() {
        if (!animationActive) return; // Stop if animation is canceled

        if (lineIndex < asciiBoxLines.length) {
            const currentLine = asciiBoxLines[lineIndex];
            if (charIndex < currentLine.length) {
                // Add the current character to the display
                const visibleText = asciiBoxLines
                    .slice(0, lineIndex)
                    .concat([currentLine.slice(0, charIndex + 1)])
                    .join('\n');
                textTarget.textContent = visibleText;

                charIndex++;
                timeoutId = setTimeout(typeLine, delay);
            } else {
                // Move to the next line
                lineIndex++;
                charIndex = 0;
                timeoutId = setTimeout(typeLine, delay);
            }
        }
    }

    textTarget.textContent = ''; // Start fresh
    setTimeout(() => typeLine(), 1000); // Add 1-second delay before starting

    return {
        stop: () => {
            animationActive = false; // Disable further execution
            clearTimeout(timeoutId); // Clear any pending timeouts
            clearContainer(textTarget); // Clear text content
        },
    };
}

    function clearContainer(target) {
        target.textContent = ''; // Clear all text content
    }

    let currentBreakpoint = getBreakpoint(); // Track the current breakpoint

    elements.forEach((element) => {
        let typingController = null;

        function updateTypingAnimation() {
            const newBreakpoint = getBreakpoint();
            if (newBreakpoint !== currentBreakpoint) {
                // Stop the current animation if breakpoint changes
                if (typingController) {
                    typingController.stop();
                    typingController = null;
                }

                // Update the breakpoint and restart animation
                currentBreakpoint = newBreakpoint;
                typingController = initTypingAnimation(element, currentBreakpoint);
            }
        }

        ScrollTrigger.create({
            trigger: element,
            start: "top top",
            end: "bottom bottom",

            onEnter: () => {
                typingController = initTypingAnimation(element, currentBreakpoint); // Start typing animation
            },
            onEnterBack: () => {
                typingController = initTypingAnimation(element, currentBreakpoint); // Restart animation on re-entry
            },
            onLeave: () => {
                if (typingController) {
                    typingController.stop(); // Stop animation
                    typingController = null;
                }
            },
            onLeaveBack: () => {
                if (typingController) {
                    typingController.stop(); // Stop animation
                    typingController = null;
                }
            },
        });

        // Listen for window resize to adjust breakpoint-based content
        window.addEventListener("resize", () => {
            updateTypingAnimation();
        });
    });
});
