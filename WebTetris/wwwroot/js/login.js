function setupPasswordToggle() {
    const toggleButton = document.getElementById('togglePassword');
    if (toggleButton) {
        toggleButton.addEventListener('click', function () {
            const passwordField = document.getElementById('passwordField');
            const passwordText = document.getElementById('passwordText');

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                passwordText.textContent = 'Hide';
                this.setAttribute('title', 'Hide password');
            } else {
                passwordField.type = 'password';
                passwordText.textContent = 'Show';
                this.setAttribute('title', 'Show password');
            }
        });
    }
}

function setupFormValidation() {
    (function () {
        'use strict';
        window.addEventListener('load', function () {
            var forms = document.getElementsByClassName('needs-validation');
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }, false);
            });
        }, false);
    })();
}

document.addEventListener('DOMContentLoaded', function () {
    setupPasswordToggle();
    setupFormValidation();
});