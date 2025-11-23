document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    // Configuration constants
    const FORM_RESET_DELAY_MS = 3000;

    // Form validation patterns
    const validators = {
        name: {
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
            message: 'Por favor ingresa un nombre válido (2-50 caracteres)'
        },
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Por favor ingresa un correo electrónico válido'
        },
        phone: {
            regex: /^[0-9]{10}$/,
            message: 'Por favor ingresa un teléfono válido (10 dígitos)'
        },
        subject: {
            regex: /^.{3,100}$/,
            message: 'El asunto debe tener entre 3 y 100 caracteres'
        },
        message: {
            regex: /^.{10,500}$/,
            message: 'El mensaje debe tener entre 10 y 500 caracteres'
        }
    };

    // Real-time validation for each field
    Object.keys(validators).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        field.addEventListener('blur', function() {
            validateField(fieldName, field.value, errorElement);
        });

        field.addEventListener('input', function() {
            if (errorElement.textContent) {
                validateField(fieldName, field.value, errorElement);
            }
        });
    });

    // Validate individual field
    function validateField(fieldName, value, errorElement) {
        const validator = validators[fieldName];
        
        if (!value.trim()) {
            errorElement.textContent = 'Este campo es obligatorio';
            return false;
        }
        
        if (!validator.regex.test(value)) {
            errorElement.textContent = validator.message;
            return false;
        }
        
        errorElement.textContent = '';
        return true;
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;

        // Validate all fields
        Object.keys(validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(fieldName + 'Error');
            
            if (!validateField(fieldName, field.value, errorElement)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Collect form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            // Display success message
            successMessage.style.display = 'block';
            form.style.display = 'none';

            // Log form data (in a real application, this would be sent to a server)
            console.log('Form submitted successfully:', formData);

            // Reset form after configured delay
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.style.display = 'none';
            }, FORM_RESET_DELAY_MS);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
