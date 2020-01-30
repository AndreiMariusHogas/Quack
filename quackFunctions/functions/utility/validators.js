
const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

exports.validateSignupData = (data) => {
    let errors = {};
    if(isEmpty(data.email)){
        errors.email = 'Email must not be emtpy';
    } else if (!isEmail(data.email)) {
        errors.email = 'You must fill in a valid email address';
    }
    if(isEmpty(data.password)){
        errors.password = "You must fill in your password";
    }
    if(data.password !== data.confirmPassword){
        errors.confirmPassword = "Passwords did not match";
    }
    if(isEmpty(data.nickname)){
        errors.nickname = "You must choose a nickname";
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    let errors = {}
    if(isEmpty(data.email)) {
        errors.email = "Fill in your email";
    }
    if(isEmpty(data.password)) {
        errors.password = "Fill in your password";
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}