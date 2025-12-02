/* ========================================
   GLOBAL JAVASCRIPT
   - Mobile nav toggle
   - Logo & chatbot buttons
   - Pricing to Signup plan selection
   - Sign In / Sign Up flows
   - Checkout logic (plan, totals, formatting)
   - Contact form handler
======================================== */

/* Mobile menu toggle for small screens */
function toggleMenu() {
    const nav = document.getElementById("navLinks");
    if (nav) {
        nav.classList.toggle("active");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    /* ----------------------------------------
       NAV: logo click to go home
    ---------------------------------------- */
    const logos = document.querySelectorAll(".logo");
    logos.forEach((logo) => {
        logo.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    });

    /* ----------------------------------------
       NAV: mobile hamburger menu
    ---------------------------------------- */
    const menuToggles = document.querySelectorAll(".menu-toggle");
    menuToggles.forEach((btn) => {
        btn.addEventListener("click", toggleMenu);
    });

    /* ----------------------------------------
       CHATBOT: floating button to contact page
    ---------------------------------------- */
    const chatbots = document.querySelectorAll(".chatbot");
    chatbots.forEach((btn) => {
        btn.addEventListener("click", () => {
            window.location.href = "contact.html";
        });
    });

    /* ----------------------------------------
       PRICING: select plan buttons
       (billing.html to signup.html?plan=...)
    ---------------------------------------- */
    const planButtons = document.querySelectorAll("[data-plan]");
    planButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const plan = btn.getAttribute("data-plan") || "premium";
            window.location.href = "signup.html?plan=" + plan;
        });
    });

    /* ----------------------------------------
       SIGN IN PAGE
       - Form id="signinForm"
    ---------------------------------------- */
    const signinForm = document.getElementById("signinForm");
    if (signinForm) {
        signinForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Show loading state
            const submitBtn = signinForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Signing In...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            // In a real app you would validate credentials here
            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        });
    }

    /* ----------------------------------------
       SIGN UP PAGE
       - Form id="signupForm"
       - Plan passed from billing.html via ?plan=
    ---------------------------------------- */
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const params = new URLSearchParams(window.location.search);
            const selectedPlan = params.get("plan") || "premium";

            // Show loading state
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Creating Account...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            // In a real app you would send data to backend here
            setTimeout(() => {
                window.location.href = "checkout.html?plan=" + selectedPlan;
            }, 800);
        });
    }

    /* ----------------------------------------
       CONTACT PAGE
       - Form id="contactForm"
    ---------------------------------------- */
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";
            
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = "Send Message";
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                alert("Thank you! Your message has been sent successfully.");
            }, 800);
        });
    }

    /* ----------------------------------------
       CHECKOUT PAGE
       - Form id="checkoutForm"
       - Reads ?plan=basic|premium|ultimate
       - Calculates tax + total
       - Formats card + expiry fields
    ---------------------------------------- */
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const planKey = urlParams.get("plan") || "premium";

        const plans = {
            basic:  { name: "Basic Plan",    price: 19 },
            premium:{ name: "Premium Plan",  price: 39 },
            ultimate:{ name: "Ultimate Plan",price: 69 }
        };

        const selectedPlan = plans[planKey] || plans["premium"];

        const planNameEl   = document.getElementById("selected-plan");
        const subtotalEl   = document.getElementById("subtotal");
        const taxEl        = document.getElementById("tax");
        const totalEl      = document.getElementById("total");

        if (planNameEl) {
            planNameEl.textContent = selectedPlan.name;
        }

        const tax = selectedPlan.price * 0.13;
        const total = selectedPlan.price + tax;

        if (subtotalEl) subtotalEl.textContent = "$" + selectedPlan.price.toFixed(2);
        if (taxEl)      taxEl.textContent = "$" + tax.toFixed(2);
        if (totalEl)    totalEl.textContent = "$" + total.toFixed(2);

        // Card number formatting: 1234 5678 9012 3456
        const cardInput = document.getElementById("card");
        if (cardInput) {
            cardInput.addEventListener("input", (e) => {
                const value = e.target.value.replace(/\s/g, "");
                e.target.value = value.match(/.{1,4}/g)?.join(" ") || value;
            });
        }

        // Expiry formatting: MM/YY
        const expiryInput = document.getElementById("expiry");
        if (expiryInput) {
            expiryInput.addEventListener("input", (e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 4) value = value.slice(0, 4);
                if (value.length >= 3) {
                    value = value.slice(0, 2) + "/" + value.slice(2);
                }
                e.target.value = value;
            });
        }

        // Form submit
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name  = document.getElementById("fullname")?.value || "Member";
            const email = document.getElementById("email")?.value || "";
            
            // Show loading state
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Processing Payment...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            setTimeout(() => {
                alert(`Payment Successful!

Welcome to Fitness Motivation+, ${name}!

Plan: ${selectedPlan.name}
Amount Charged: $${total.toFixed(2)}

Confirmation email sent to: ${email}

(Real website would use Stripe)
`);

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            }, 1000);
        });
    }
});