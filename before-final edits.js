



    // ------------------------- Logo Section -------------------------
// Select the container div and body
// Select all elements with the specified classes
const hashContainers = document.querySelectorAll(".client-logo_textoverlay-hidden, .case-study_textoverlay-hidden");

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

// ------------- logo section text animation -----------

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".clients_stcky-section");

    gsap.registerPlugin(ScrollTrigger);

    function initTypingAnimation(container) {
        const textTarget = container.querySelector(".client-logo_textoverlay");
        const hiddenContent = container.querySelector(".client-logo_textoverlay-hidden");

        if (!textTarget || !hiddenContent) return null;

        const asciiBox = hiddenContent.textContent;
        const totalDuration = 1; // Total animation duration in seconds (faster)
        const totalChars = asciiBox.length;
        const charsPerFrame = Math.ceil(totalChars / (totalDuration * 60)); // Characters per frame at ~60fps

        let currentIndex = 0;

        function typeChunk() {
            // Add a chunk of characters to the visible text
            currentIndex = Math.min(currentIndex + charsPerFrame, totalChars);
            textTarget.textContent = asciiBox.slice(0, currentIndex);

            // Stop when all characters are rendered
            if (currentIndex < totalChars) {
                requestAnimationFrame(typeChunk);
            }
        }

        // Clear previous content and start typing
        textTarget.textContent = '';
        requestAnimationFrame(typeChunk);
    }

    elements.forEach((element) => {
        ScrollTrigger.create({
            trigger: element,
            start: "top top",
            end: "bottom bottom",
            onEnter: () => initTypingAnimation(element),
            onEnterBack: () => initTypingAnimation(element),
            onLeave: () => clearContainer(element.querySelector(".client-logo_textoverlay")),
            onLeaveBack: () => clearContainer(element.querySelector(".client-logo_textoverlay")),
        });
    });

    function clearContainer(target) {
        if (target) target.textContent = '';
    }
});

///-------------------------content section------------
document.addEventListener("DOMContentLoaded", () => {
    // Select all content-sticky wrappers
    const wrappers = document.querySelectorAll(".content-sticky_wrapper");

    // GSAP ScrollTrigger and typing animation setup
    gsap.registerPlugin(ScrollTrigger); // Register GSAP ScrollTrigger plugin

    const breakpoints = [
        { min: 992, class: "desktop" },
        { min: 768, max: 991, class: "tablet" },
        { min: 480, max: 767, class: "large-mobile" },
        { min: 300, max: 479, class: "small-mobile" },
        { max: 299, class: "extra-small" },
    ];

    let activeTypingController = null; // Keep track of the active typing animation

    function getCurrentBreakpoint() {
        const width = window.innerWidth;
        return breakpoints.find(bp => {
            return (
                (bp.min === undefined || width >= bp.min) &&
                (bp.max === undefined || width <= bp.max)
            );
        });
    }

    function clearContainer(target) {
        target.textContent = ''; // Clear all text content
    }

    function initTypingAnimation(visibleElement, hiddenContent) {
    if (!visibleElement || !hiddenContent) return null;

    clearContainer(visibleElement); // Clear any existing content

    const asciiBox = hiddenContent.textContent;
    const asciiBoxLines = asciiBox.split('\n');
    let lineIndex = 0;
    let charIndex = 0;
    let animationActive = true; // Control flag for stopping the animation
    let timeoutId = null;

    const totalChars = asciiBox.length;
    const totalDuration = 10; // Total animation duration in ms
    const charsPerStep = 3; // Number of characters added per step
    const delay = (totalDuration / totalChars) * charsPerStep;

    function typeLine() {
        if (!animationActive) return; // Stop if animation is canceled

        if (lineIndex < asciiBoxLines.length) {
            const currentLine = asciiBoxLines[lineIndex];
            if (charIndex < currentLine.length) {
                const visibleText = asciiBoxLines
                    .slice(0, lineIndex)
                    .concat([currentLine.slice(0, charIndex + charsPerStep)]) // Append multiple characters
                    .join('\n');
                visibleElement.textContent = visibleText;

                charIndex += charsPerStep; // Move forward by charsPerStep
                timeoutId = setTimeout(typeLine, delay);
            } else {
                lineIndex++;
                charIndex = 0;
                timeoutId = setTimeout(typeLine, delay);
            }
        }
    }

    visibleElement.textContent = ''; // Start fresh
    setTimeout(() => typeLine(), 500); // Add delay before starting

    return {
        stop: () => {
            animationActive = false; // Disable further execution
            clearTimeout(timeoutId); // Clear any pending timeouts
            clearContainer(visibleElement); // Clear text content
        },
    };
}


    function updateVisibleContent(wrapper) {
        const allVisible = wrapper.querySelectorAll(".content-ascii-box .text-animation:not(.text-animation-hidden)");
        allVisible.forEach(element => clearContainer(element)); // Clear all visible containers

        const currentBreakpoint = getCurrentBreakpoint();
        if (!currentBreakpoint) return;

        const hiddenElement = wrapper.querySelector(`.content-ascii-box.${currentBreakpoint.class}.text-animation-hidden`);
        const visibleElement = wrapper.querySelector(`.content-ascii-box.${currentBreakpoint.class}.text-animation:not(.text-animation-hidden`);

        if (hiddenElement && visibleElement) {
            // Apply GSAP ScrollTrigger for this wrapper
            ScrollTrigger.create({
                trigger: wrapper, // Wrapper is the trigger
                start: "top top", // Starts animation when the wrapper's top reaches the center of the viewport
                end:"bottom bottom",
                
                
                onEnter: () => {
                    if (activeTypingController) {
                        activeTypingController.stop(); // Stop any existing animation
                    }
                    activeTypingController = initTypingAnimation(visibleElement, hiddenElement);
                },
                onEnterBack: () => {
                    if (activeTypingController) {
                        activeTypingController.stop(); // Stop any existing animation
                    }
                    activeTypingController = initTypingAnimation(visibleElement, hiddenElement);
                },
                onLeave: () => {
                    if (activeTypingController) {
                        activeTypingController.stop(); // Stop animation when leaving
                        activeTypingController = null;
                    }
                },
                onLeaveBack: () => {
                    if (activeTypingController) {
                        activeTypingController.stop(); // Stop animation when scrolling back out
                        activeTypingController = null;
                    }
                },
            });
        }
    }

    function onResize() {
        if (activeTypingController) {
            activeTypingController.stop(); // Stop current animation during resize
            activeTypingController = null;
        }
        ScrollTrigger.refresh(); // Refresh GSAP triggers on resize
        wrappers.forEach(updateVisibleContent); // Update the visible content dynamically on resize
    }

    // Initialize for each wrapper
    wrappers.forEach(updateVisibleContent);

    // Handle resize events
    window.addEventListener("resize", onResize);
});

// -------------------------case study ------------

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".case_sticky-section");

    gsap.registerPlugin(ScrollTrigger);

    // Helper: Clear text content in the container
    function clearContainer(target) {
        target.textContent = ''; // Clear all text content
    }

    // Helper: Wrap lines to fit within maxWidth
    function wrapLine(line, maxWidth) {
        const wrappedLines = [];
        const words = line.split(' ');
        let currentLine = '';

        words.forEach((word) => {
            if ((currentLine + word).length + 1 > maxWidth) { // +1 for space
                wrappedLines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });

        if (currentLine.length > 0) {
            wrappedLines.push(currentLine.trim());
        }

        return wrappedLines;
    }

    // Helper: Dynamically calculate character width
    function getCharWidth(container) {
        const testSpan = document.createElement('span');
        testSpan.textContent = 'M';
        testSpan.style.font = getComputedStyle(container).font;
        testSpan.style.position = 'absolute';
        testSpan.style.visibility = 'hidden';
        document.body.appendChild(testSpan);
        const charWidth = testSpan.offsetWidth;
        document.body.removeChild(testSpan);
        return charWidth;
    }

    // Helper: Generate ASCII box dynamically for content
    function generateAsciiBox(content, container) {
        const charWidth = getCharWidth(container);
        const maxWidthChars = Math.floor(container.clientWidth / charWidth) - 4; // Reserve space for "| " padding
        const contentLines = content.split('\n').flatMap((line) => wrapLine(line, maxWidthChars));
        const maxLength = Math.max(...contentLines.map((line) => line.length));

        const borderLine = `+${'-'.repeat(maxLength + 2)}+`;
        const asciiBoxLines = [borderLine];

        // Add "Case Studies" title, centered
        const title = "Case Studies";
        const centeredTitle = title.padStart(Math.floor((maxLength + title.length) / 2)).padEnd(maxLength);
        asciiBoxLines.push(`| ${centeredTitle} |`);
        asciiBoxLines.push(`| ${'-'.repeat(maxLength)} |`); // Horizontal separator

        // Add the rest of the content, left-aligned
        contentLines.forEach((line) => {
            const paddedLine = line.padEnd(maxLength); // Ensure each line is the same length
            asciiBoxLines.push(`| ${paddedLine} |`);
        });

        asciiBoxLines.push(borderLine);

        return asciiBoxLines.join('\n');
    }

    // Typing Animation for ASCII Box
    function initTypingAnimation(container) {
        const textTarget = container.querySelector(".case-study_text");
        const hiddenContent = container.querySelector(".case-study-text_hidden");
        if (!textTarget || !hiddenContent) return null;

        clearContainer(textTarget); // Clear any existing content

        const asciiBox = generateAsciiBox(hiddenContent.textContent.trim(), textTarget);
        const asciiBoxLines = asciiBox.split('\n');
        let lineIndex = 0;
        let charIndex = 0;
        const charsPerStep = 5; // Number of characters per step
        const totalDuration = 1500; // Total animation duration in ms
        const delay = (totalDuration / asciiBox.length) * charsPerStep;

        function typeLine() {
            if (lineIndex < asciiBoxLines.length) {
                const currentLine = asciiBoxLines[lineIndex];
                if (charIndex < currentLine.length) {
                    const endCharIndex = Math.min(charIndex + charsPerStep, currentLine.length);
                    const visibleText = asciiBoxLines
                        .slice(0, lineIndex)
                        .concat([currentLine.slice(0, endCharIndex)])
                        .join('\n');
                    textTarget.textContent = visibleText;

                    charIndex = endCharIndex; // Move forward by charsPerStep
                    setTimeout(typeLine, delay);
                } else {
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeLine, delay); // Move to next line
                }
            }
        }

        setTimeout(() => typeLine(), 500); // Add a slight delay before starting
    }

    // Scroll-triggered ASCII animation
    elements.forEach((element) => {
        let typingController = null;

        ScrollTrigger.create({
            trigger: element,
            start: "top top",
            end: "bottom bottom",

            onEnter: () => {
                if (!typingController) {
                    typingController = initTypingAnimation(element);
                }
            },
            onEnterBack: () => {
                if (!typingController) {
                    typingController = initTypingAnimation(element);
                }
            },
            onLeave: () => {
                if (typingController) {
                    typingController = null;
                }
            },
            onLeaveBack: () => {
                if (typingController) {
                    typingController = null;
                }
            },
        });
    });

    // Debounced Resize Handling
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            elements.forEach((element) => {
                const textTarget = element.querySelector(".case-study_text");
                const hiddenContent = element.querySelector(".case-study-text_hidden");

                if (textTarget && hiddenContent) {
                    const newAsciiBox = generateAsciiBox(hiddenContent.textContent.trim(), textTarget);
                    textTarget.textContent = newAsciiBox; // Update content to fit new size
                }
            });
        }, 300);
    });
});


    // ------------------------- case study section -------------------------
 
function wrapLine(line, maxWidth) {
        const wrappedLines = [];
        const words = line.split(' ');
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + word).length > maxWidth) {
                wrappedLines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });

        if (currentLine.length > 0) {
            wrappedLines.push(currentLine.trim());
        }

        return wrappedLines;
    }

    // Generate ASCII box dynamically for content
    function generateAsciiBox(content, container) {
        const maxWidthChars = Math.max(80, Math.floor(container.clientWidth / 8)); // Minimum width: 40 chars
        const contentLines = content.split('\n').flatMap(line => wrapLine(line, maxWidthChars));
        const maxLength = Math.max(...contentLines.map(line => line.length));

        const borderLine = `+${'-'.repeat(maxLength + 2)}+`;
        const asciiBoxLines = [borderLine];

        // Add "Case Studies" title and underline it
        const title = "Case Studies".padStart(Math.floor((maxLength + "Case Studies".length) / 2)).padEnd(maxLength);
        asciiBoxLines.push(`| ${title} |`);
        asciiBoxLines.push(`| ${'-'.repeat(maxLength)} |`); // Horizontal line after "Case Studies"

        // Add the rest of the content, right-aligned
        contentLines.forEach(line => {
            const paddedLine = line.padStart(maxLength); // Right-align the text
            asciiBoxLines.push(`| ${paddedLine} |`);
        });

        asciiBoxLines.push(borderLine);

        return asciiBoxLines.join('\n');
    }

    // Typing animation with content fetched from HTML
  function initTypingAnimation() {
    const containers = document.querySelectorAll('.case-study_textt'); // All containers for ASCII boxes
    const contentElements = document.querySelectorAll('.case-study-text_hiddent'); // Corresponding hidden content elements

    containers.forEach((container, index) => {
        const contentElement = contentElements[index];
        const content = contentElement ? contentElement.textContent.trim() : ''; // Get content for the container
        const asciiBox = generateAsciiBox(content, container);
        const asciiBoxLines = asciiBox.split('\n');
        let lineIndex = 0;
        let charIndex = 0;
        const charsPerStep = 5; // Number of characters to print per step
        const delay = 30; // Typing speed in milliseconds per step

        // Recursive function to type each line
        function typeLine() {
            if (lineIndex < asciiBoxLines.length) {
                const currentLine = asciiBoxLines[lineIndex];
                if (charIndex < currentLine.length) {
                    const endCharIndex = Math.min(charIndex + charsPerStep, currentLine.length);
                    container.textContent += currentLine.slice(charIndex, endCharIndex);
                    charIndex = endCharIndex; // Move the character pointer forward
                    setTimeout(typeLine, delay); // Continue typing next set of characters
                } else {
                    container.textContent += '\n'; // Move to next line
                    charIndex = 0;
                    lineIndex++;
                    setTimeout(typeLine, delay); // Move to next line
                }
            }
        }

        typeLine(); // Start typing animation
    });
}


    // Initialize typing animation on page load
    document.addEventListener('DOMContentLoaded', initTypingAnimation);

    // Update ASCII box dynamically on resize
    window.addEventListener('resize', () => {
        document.querySelectorAll('.ascii-container').forEach(container => {
            container.textContent = ''; // Clear content
        });
        initTypingAnimation(); // Restart animation
    });
    
    
    //-------------------------console animation-------------------
    
    
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

    function initTypingAnimation(container, breakpoint) {
        const textTarget = container.querySelector(".text-animation");
        const hiddenContent = container.querySelector(`.text-animation-hidden[data-breakpoint="${breakpoint}"]`);
        if (!textTarget || !hiddenContent) return null;

        clearContainer(textTarget); // Clear any existing content

        const asciiBox = hiddenContent.textContent.trim();
        const asciiBoxLines = asciiBox.split('\n').map(line => line.trim());
        let lineIndex = 0;
        let charIndex = 0;
        let animationActive = true; // Control flag for stopping the animation
        let timeoutId = null;

        // Dynamically adjust animation speed based on breakpoint
        const totalChars = asciiBox.length;
        const speedMultiplier = {
            desktop: 1500,
            tablet: 1200,
            "large-mobile": 900,
            "small-mobile": 600,
        };
        const totalDuration = speedMultiplier[breakpoint] || 1500;
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
        setTimeout(() => typeLine(), 500); // Add 0.5-second delay before starting

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


// text box animation 
//---------------------footer section
document.addEventListener("DOMContentLoaded", () => {
    // Select all content-sticky wrappers
    const wrappers = document.querySelectorAll(".footer-sticky_wrapper");

    // GSAP ScrollTrigger and typing animation setup
    gsap.registerPlugin(ScrollTrigger); // Register GSAP ScrollTrigger plugin

    const breakpoints = [
        { min: 992, class: "desktop" },
        { min: 768, max: 991, class: "tablet" },
        { min: 480, max: 767, class: "large-mobile" },
        { min: 300, max: 479, class: "small-mobile" },
        { max: 299, class: "extra-small" },
    ];

    let activeTypingController = null; // Keep track of the active typing animation

    function getCurrentBreakpoint() {
        const width = window.innerWidth;
        return breakpoints.find(bp => {
            return (
                (bp.min === undefined || width >= bp.min) &&
                (bp.max === undefined || width <= bp.max)
            );
        });
    }

    function clearContainer(target) {
        target.textContent = ''; // Clear all text content
    }

    function initTypingAnimation(visibleElement, hiddenContent) {
    if (!visibleElement || !hiddenContent) return null;

    clearContainer(visibleElement); // Clear any existing content

    const asciiBox = hiddenContent.textContent;
    const asciiBoxLines = asciiBox.split('\n');
    let lineIndex = 0;
    let charIndex = 0;
    let animationActive = true; // Control flag for stopping the animation
    let timeoutId = null;

    const totalChars = asciiBox.length;
    const totalDuration = 10; // Total animation duration in ms
    const charsPerStep = 3; // Number of characters added per step
    const delay = (totalDuration / totalChars) * charsPerStep;

    function typeLine() {
        if (!animationActive) return; // Stop if animation is canceled

        if (lineIndex < asciiBoxLines.length) {
            const currentLine = asciiBoxLines[lineIndex];
            if (charIndex < currentLine.length) {
                const visibleText = asciiBoxLines
                    .slice(0, lineIndex)
                    .concat([currentLine.slice(0, charIndex + charsPerStep)]) // Append multiple characters
                    .join('\n');
                visibleElement.textContent = visibleText;

                charIndex += charsPerStep; // Move forward by charsPerStep
                timeoutId = setTimeout(typeLine, delay);
            } else {
                lineIndex++;
                charIndex = 0;
                timeoutId = setTimeout(typeLine, delay);
            }
        }
    }

    visibleElement.textContent = ''; // Start fresh
    setTimeout(() => typeLine(), 500); // Add delay before starting

    return {
        stop: () => {
            animationActive = false; // Disable further execution
            clearTimeout(timeoutId); // Clear any pending timeouts
            clearContainer(visibleElement); // Clear text content
        },
    };
}


    function updateVisibleContent(wrapper) {
        const allVisible = wrapper.querySelectorAll(".content-ascii-box .text-animation:not(.text-animation-hidden)");
        allVisible.forEach(element => clearContainer(element)); // Clear all visible containers

        const currentBreakpoint = getCurrentBreakpoint();
        if (!currentBreakpoint) return;

        const hiddenElement = wrapper.querySelector(`.content-ascii-box.${currentBreakpoint.class}.text-animation-hidden`);
        const visibleElement = wrapper.querySelector(`.content-ascii-box.${currentBreakpoint.class}.text-animation:not(.text-animation-hidden`);

        if (hiddenElement && visibleElement) {
            // Apply GSAP ScrollTrigger for this wrapper
            ScrollTrigger.create({
                trigger: wrapper, // Wrapper is the trigger
                start: "top top", // Starts animation when the wrapper's top reaches the center of the viewport
                end:"bottom bottom",
               
                
                
                onEnter: () => {
                    if (activeTypingController) {
                        activeTypingController.stop(); // Stop any existing animation
                    }
                    activeTypingController = initTypingAnimation(visibleElement, hiddenElement);
                },

                onLeaveBack: () => {
                    if (activeTypingController) {
                        activeTypingController.stop(); // Stop animation when scrolling back out
                        activeTypingController = null;
                    }
                },
            });
        }
    }

    function onResize() {
        if (activeTypingController) {
            activeTypingController.stop(); // Stop current animation during resize
            activeTypingController = null;
        }
        ScrollTrigger.refresh(); // Refresh GSAP triggers on resize
        wrappers.forEach(updateVisibleContent); // Update the visible content dynamically on resize
    }

    // Initialize for each wrapper
    wrappers.forEach(updateVisibleContent);

    // Handle resize events
    window.addEventListener("resize", onResize);
});
document.addEventListener("DOMContentLoaded", () => {
    // Select all content-sticky wrappers
    const wrappers = document.querySelectorAll(".footer-sticky_wrappernnn");

    // GSAP ScrollTrigger and typing animation setup
    gsap.registerPlugin(ScrollTrigger); // Register GSAP ScrollTrigger plugin

    const breakpoints = [
        { min: 800, class: "desktop" },
        { min: 600, max: 799, class: "tablet" },
        { min: 400, max: 599, class: "large-mobile" },
        { min: 300, max: 399, class: "small-mobile" },
        { max: 299, class: "extra-small" },
    ];

    let activeTypingController = null; // Keep track of the active typing animation

    function getCurrentBreakpoint() {
        const width = window.innerWidth;
        return breakpoints.find(bp => {
            return (
                (bp.min === undefined || width >= bp.min) &&
                (bp.max === undefined || width <= bp.max)
            );
        });
    }

    function clearContainer(target) {
        target.textContent = ''; // Clear all text content
    }

   function initTypingAnimation(visibleElement, hiddenContent) {
    if (!visibleElement || !hiddenContent) return null;

    clearContainer(visibleElement); // Clear any existing content

    const asciiBox = hiddenContent.textContent;
    const asciiBoxLines = asciiBox.split('\n');
    let lineIndex = 0;
    let charIndex = 0;
    let animationActive = true; // Control flag for stopping the animation
    let timeoutId = null;

    const totalChars = asciiBox.length;
    const totalDuration = 10; // Total animation duration in ms
    const charsPerStep = 3; // Number of characters added per step
    const delay = (totalDuration / totalChars) * charsPerStep;

    function typeLine() {
        if (!animationActive) return; // Stop if animation is canceled

        if (lineIndex < asciiBoxLines.length) {
            const currentLine = asciiBoxLines[lineIndex];
            if (charIndex < currentLine.length) {
                const visibleText = asciiBoxLines
                    .slice(0, lineIndex)
                    .concat([currentLine.slice(0, charIndex + charsPerStep)]) // Append multiple characters
                    .join('\n');
                visibleElement.textContent = visibleText;

                charIndex += charsPerStep; // Move forward by charsPerStep
                timeoutId = setTimeout(typeLine, delay);
            } else {
                lineIndex++;
                charIndex = 0;
                timeoutId = setTimeout(typeLine, delay);
            }
        }
    }

    visibleElement.textContent = ''; // Start fresh
    setTimeout(() => typeLine(), 500); // Add delay before starting

    return {
        stop: () => {
            animationActive = false; // Disable further execution
            clearTimeout(timeoutId); // Clear any pending timeouts
            clearContainer(visibleElement); // Clear text content
        },
    };
}

    function updateVisibleContent(wrapper) {
        const allVisible = wrapper.querySelectorAll(".content-ascii-box.text-animation.visible");
        allVisible.forEach(element => clearContainer(element)); // Clear all visible containers

        const currentBreakpoint = getCurrentBreakpoint();
        if (!currentBreakpoint) return;

        const hiddenElement = wrapper.querySelector(`.content-ascii-box.${currentBreakpoint.class}.text-animation-hidden`);
        const visibleElement = wrapper.querySelector(`.content-ascii-box.${currentBreakpoint.class}.text-animation.visible`);

        if (hiddenElement && visibleElement) {
            // Apply GSAP ScrollTrigger for this wrapper
            ScrollTrigger.create({
                trigger: wrapper, // Wrapper is the trigger
                start: "top top", // Starts animation when the wrapper's top reaches the center of the viewport
                end:"bottom bottom",
               
                
                onEnter: () => {
                    if (activeTypingController) {
                        activeTypingController.stop(); // Stop any existing animation
                    }
                    activeTypingController = initTypingAnimation(visibleElement, hiddenElement);
                },
              
                
                onLeaveBack: () => {
                    if (activeTypingController) {
                        activeTypingController.stop(); // Stop animation when scrolling back out
                        activeTypingController = null;
                    }
                },
            });
        }
    }

    function onResize() {
        if (activeTypingController) {
            activeTypingController.stop(); // Stop current animation during resize
            activeTypingController = null;
        }
        ScrollTrigger.refresh(); // Refresh GSAP triggers on resize
        wrappers.forEach(updateVisibleContent); // Update the visible content dynamically on resize
    }

    // Initialize for each wrapper
    wrappers.forEach(updateVisibleContent);

    // Handle resize events
    window.addEventListener("resize", onResize);
});

////----------------case study----------
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".case-image_sticky");

    gsap.registerPlugin(ScrollTrigger);

    function initTypingAnimation(container) {
        const textTarget = container.querySelector(".case-study_textoverlay");
        const hiddenContent = container.querySelector(".case-study_textoverlay-hidden");

        if (!textTarget || !hiddenContent) return null;

        const asciiBox = hiddenContent.textContent;
        const totalDuration = 0.5; // Total animation duration in seconds
        const totalChars = asciiBox.length;
        const charsPerFrame = Math.ceil(totalChars / (totalDuration * 60)); // Characters per frame for fast rendering

        let currentIndex = 0;

        function typeChunk() {
            // Add a chunk of characters to the visible text
            currentIndex = Math.min(currentIndex + charsPerFrame, totalChars);
            textTarget.textContent = asciiBox.slice(0, currentIndex);

            // Stop when all characters are rendered
            if (currentIndex < totalChars) {
                requestAnimationFrame(typeChunk);
            }
        }

        // Clear previous content and start typing
        textTarget.textContent = '';
        requestAnimationFrame(typeChunk);
    }

    elements.forEach((element) => {
        ScrollTrigger.create({
            trigger: element,
            start: "top top",
            end: "bottom bottom",
            onEnter: () => initTypingAnimation(element),
            onEnterBack: () => initTypingAnimation(element),
            onLeave: () => clearContainer(element.querySelector(".case-study_textoverlay")),
            onLeaveBack: () => clearContainer(element.querySelector(".case-study_textoverlay")),
        });
    });

    function clearContainer(target) {
        if (target) target.textContent = '';
    }
});



