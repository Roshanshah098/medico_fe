
export const isValidDate = (dateString: string): boolean => {
    if (!dateString) return false;
  
    const inputDate = new Date(dateString);
    if (isNaN(inputDate.getTime())) return false;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
  
    return inputDate < today;
  };
  
  export const isValidPhoneNumber = (phone: string): boolean => {
    // Check if phone is 10 digits and starts with 9 (mobile) or is a landline number
    const mobileRegex = /^9\d{9}$/; 
    const landlineRegex = /^[0-9]{7,10}$/; 
    return mobileRegex.test(phone) || landlineRegex.test(phone);
  };
  
  
  export const isValidEmail = (email: string): boolean => {
    // Basic email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  
  export const isValidDOB = (dobString: string): boolean => {
    if (!dobString) return false;
  
    const parts = dobString.split("-");
    if (parts.length !== 3) return false;
  
    const [year, month, day] = parts.map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  
    const dobDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
  
    // Calculate age
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const isBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && today.getDate() >= dobDate.getDate());
  
    // Check if the date is in the future or if the age is less than 16
    return dobDate <= today && (isBirthdayPassed ? age >= 14 : age > 14);
  };
  
  
  export const isValidPastDate = (dateString: string): boolean => {
    if (!dateString) return false;
  
    const inputDate = new Date(dateString);
    if (isNaN(inputDate.getTime())) return false;
  
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
  
    // Check if the input date is not in the future
    return inputDate < today;
  };
  
  
  