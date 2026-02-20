import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class RandomPasswordService {
  generatePassword(length: number): string {
    const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const smallLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialSymbols = '!@#$%^&*()';

    const allChars = capitalLetters + numbers + specialSymbols;
    const allCharsLength = allChars.length;

    let password = '';

    password += capitalLetters.charAt(
      crypto.randomInt(0, capitalLetters.length),
    );

    password += smallLetters.charAt(crypto.randomInt(0, smallLetters.length));

    password += numbers.charAt(crypto.randomInt(0, numbers.length));

    password += specialSymbols.charAt(
      crypto.randomInt(0, specialSymbols.length),
    );

    // Generate remaining characters
    for (let i = 0; i < length - 3; i++) {
      const randomIndex = crypto.randomInt(0, allCharsLength);
      password += allChars.charAt(randomIndex);
    }

    // Shuffle the password characters to make the order random
    password = this.shuffleString(password);

    return password;
  }

  // Function to shuffle a string
  private shuffleString(str: string): string {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }
}
