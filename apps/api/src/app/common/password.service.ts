import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  private readonly rounds = 12;

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  validateStrength(password: string): string | null {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'La contraseña debe incluir mayúsculas, minúsculas y números';
    }

    return null;
  }
}
