const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface ValidatePassword {
    (password: string): string;
}

export const validatePassword: ValidatePassword = (password) => {
    if (!password) {
        return "Password cannot be empty.";
    }
    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must include at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
        return "Password must include at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
        return "Password must include at least one digit.";
    }
    if (!/[@$!%*?&]/.test(password)) {
        return "Password must include at least one special character (@, $, !, %, *, ?, &).";
    }
    if (passwordPattern.test(password)) {
        return "strong";
    }
    return "Password does not meet the criteria.";
};

