// Select the container div and body
// Select all elements with the specified classes
const hashContainers = document.querySelectorAll(".client-logo_textoverlay, .case-study_textoverlay");

function fillContainerWithHashes(container) {
    // Clear any existing content
    container.textContent = "";

    // Font size (constant for consistency)
    const fontSize = 14;

    // Calculate character dimensions based on font size
    const charWidth = fontSize * 0.6; // Approximate width of monospaced characters
    const lineHeight = 13; // Approximate line height

    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate the number of characters and lines needed
    const charsPerLine = Math.floor(containerWidth / charWidth);
    const lines = Math.floor(containerHeight / lineHeight);

    // Generate the "#" pattern
    let hashString = "";
    for (let i = 0; i < lines; i++) {
        hashString += "#".repeat(charsPerLine) + "\n";
    }

    // Set the content of the div
    container.textContent = hashString;

    // Select the hidden content inside the container
    const hiddenContent = container.querySelector(".text-animation-hidden");
}

// Fill all containers initially
function fillAllContainers() {
    hashContainers.forEach(fillContainerWithHashes);
}

fillAllContainers();

// Refill all containers on window resize to keep it responsive
window.addEventListener("resize", fillAllContainers);


document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".client_sticky-section");

    gsap.registerPlugin(ScrollTrigger);

    function initTypingAnimation(container) {
        const textTarget = container.querySelector(".text-animation");
        const hiddenContent = container.querySelector(".text-animation-hidden");
        if (!textTarget || !hiddenContent) return null;

        clearContainer(textTarget); // Clear any existing content

        const asciiBox = hiddenContent.textContent;
        const asciiBoxLines = asciiBox.split('\n');
        let lineIndex = 0;
        let charIndex = 0;
        let animationActive = true; // Control flag for stopping the animation
        let timeoutId = null;

        const totalChars = asciiBox.length;
        const totalDuration = 1500; // Total animation duration in ms
        const delay = totalDuration / totalChars;

        function typeLine() {
            if (!animationActive) return; // Stop if animation is canceled

            if (lineIndex < asciiBoxLines.length) {
                const currentLine = asciiBoxLines[lineIndex];
                if (charIndex < currentLine.length) {
                    // Clear cursor, add character, and re-add cursor
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

    elements.forEach((element) => {
        let typingController = null;

        ScrollTrigger.create({
            trigger: element,
            start: "top top",
            end: "bottom bottom",
            
            onEnter: () => {
                typingController = initTypingAnimation(element); // Start typing animation
            },
            onEnterBack: () => {
                typingController = initTypingAnimation(element); // Restart animation on re-entry
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
    });
});

