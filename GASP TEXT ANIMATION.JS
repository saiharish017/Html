
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".text-animation-wrap");

    gsap.registerPlugin(ScrollTrigger);

    function initTypingAnimation(container) {
        const textTarget = container.querySelector(".text-animation");
        const hiddenContent = container.querySelector(".text-animation-hidden");
        if (!textTarget || !hiddenContent) return;

        clearContainer(textTarget); // Clear before starting

        const asciiBox = hiddenContent.textContent;
        const asciiBoxLines = asciiBox.split('\n');
        let lineIndex = 0;
        let charIndex = 0;

        const totalChars = asciiBox.length;
        const totalDuration = 1500; // Total animation duration
        const delay = totalDuration / totalChars;

        function typeLine() {
            if (lineIndex < asciiBoxLines.length) {
                const currentLine = asciiBoxLines[lineIndex];
                if (charIndex < currentLine.length) {
                    textTarget.textContent += currentLine[charIndex];
                    charIndex++;
                    setTimeout(typeLine, delay);
                } else {
                    textTarget.textContent += '\n';
                    charIndex = 0;
                    lineIndex++;
                    setTimeout(typeLine, delay);
                }
            }
        }

        textTarget.textContent = ''; // Start with empty content
        typeLine();
    }

    function clearContainer(target) {
        target.textContent = ''; // Clear all text content
    }

    elements.forEach((element) => {
    ScrollTrigger.create({
        trigger: element,
        start: "top 0%", // Animation starts when the top of the element hits the top of the viewport
        end: "top -1%", // Animation ends as soon as the element starts moving out of the viewport
        onEnter: () => initTypingAnimation(element), // Start typing animation when the element enters
        onEnterBack: () => initTypingAnimation(element), // Restart typing animation if re-entering from the top
        onLeave: () => {
            const textTarget = element.querySelector(".text-animation");
            if (textTarget) clearContainer(textTarget); // Clear text when scrolling out of view
        },
        onLeaveBack: () => {
            const textTarget = element.querySelector(".text-animation");
            if (textTarget) clearContainer(textTarget); // Clear text when scrolling out backwards
        }
    });
});
    });

