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
        let animationActive = true;
        let timeoutId = null;

        const totalChars = asciiBox.length;
        const totalDuration = 1500; // Total animation duration in ms
        const delay = totalDuration / totalChars;

        function typeLine() {
            if (!animationActive) return;

            if (lineIndex < asciiBoxLines.length) {
                const currentLine = asciiBoxLines[lineIndex];
                if (charIndex < currentLine.length) {
                    const visibleText = asciiBoxLines
                        .slice(0, lineIndex)
                        .concat([currentLine.slice(0, charIndex + 1)])
                        .join('\n');
                    textTarget.textContent = visibleText;

                    charIndex++;
                    timeoutId = setTimeout(typeLine, delay);
                } else {
                    lineIndex++;
                    charIndex = 0;
                    timeoutId = setTimeout(typeLine, delay);
                }
            }
        }

        setTimeout(() => typeLine(), 1000); // Add a 1-second delay before starting

        return {
            stop: () => {
                animationActive = false;
                clearTimeout(timeoutId);
                clearContainer(textTarget);
            },
        };
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
                    typingController.stop();
                    typingController = null;
                }
            },
            onLeaveBack: () => {
                if (typingController) {
                    typingController.stop();
                    typingController = null;
                }
            },
        });
    });

    // Debounced Resize Handling
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Stop all active animations
        elements.forEach((element) => {
            const textTarget = element.querySelector(".case-study_text");
            const typingController = element.typingController;

            if (typingController) {
                typingController.stop();
            }
        });

        // Debounce resize logic
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
