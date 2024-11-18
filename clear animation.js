elements.forEach((element) => {
    let typingAnimation = null;
    ScrollTrigger.create({
        trigger: element, // Use child trigger if available
        start: "top top", // Trigger when the top of the element aligns with the viewport top
        end: "bottom bottom", // End when the bottom of the element aligns with the viewport bottom
        markers: true, // Debug markers (remove in production)
        onEnter: () => {
        typingAnimation = initTypingAnimation(element)
        console.log("onEnter")
        }, // Start the typing animation
        onEnterBack: ()=>{
        console.log("onEnterBack")
        typingAnimation = initTypingAnimation(element)
        },
        onLeave: ()=>{
        console.log("onLeave");
        if (typingAnimation) {
                typingAnimation.pause(); // Pause the animation if supported
                typingAnimation = null; // Optionally, nullify the reference
            }
            const textTarget = element.querySelector(".text-animation");
            if (textTarget) clearContainer(textTarget); // Clear the text
        

        console.log(element.querySelector(".text-animation"))
        },
        onLeaveBack: () => {
            console.log("onLeaveBack");
            const textTarget = element.querySelector(".text-animation");
            clearContainer(textTarget)
            console.log(textTarget)
            
        },
    });
});