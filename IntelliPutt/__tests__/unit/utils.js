import { RandExp } from 'randexp';
import { experienceLevels } from './testConstants';

class Utils {
    static generateValidEmail() {
        return RandExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).gen();
    }
    
    static generateValidPassword() {
        return RandExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{6,}$/).gen();
    }
    
    static getValidExperienceLevel() {
        return experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
    }
    
    static generateValidName() {
        return RandExp(/^[a-zA-Z ]{2,}$/).gen();
    }
}

export default Utils;