import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { UserRole, Permission } from '../sharedTypes';
import type { StringValue } from 'ms';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

class AuthService {
  private readonly JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  private readonly REFRESH_TOKEN_EXPIRES_IN: StringValue = '7d';

  async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = new User({
      email: data.email.toLowerCase(),
      password: data.password,
      name: data.name,
      role: data.role || UserRole.VIEWER,
      permissions: this.getDefaultPermissions(data.role || UserRole.VIEWER)
    });

    await user.save();

    // Generate tokens
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: user.toJSON() as Omit<IUser, 'password'>,
      token,
      refreshToken
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: user.toJSON() as Omit<IUser, 'password'>,
      token,
      refreshToken
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as TokenPayload;
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      const token = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        user: user.toJSON() as Omit<IUser, 'password'>,
        token,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();

    // TODO: Send email with reset token
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateToken(user: IUser): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };

    const signOptions: SignOptions = {
      expiresIn: this.JWT_EXPIRES_IN as StringValue
    };
    return jwt.sign({ ...payload }, this.JWT_SECRET as jwt.Secret, signOptions);
  }

  private generateRefreshToken(user: IUser): string {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };

    const refreshSignOptions: SignOptions = {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN as StringValue
    };
    return jwt.sign({ ...payload }, this.JWT_SECRET as jwt.Secret, refreshSignOptions);
  }

  private getDefaultPermissions(role: UserRole): Permission[] {
    switch (role) {
      case UserRole.ADMIN:
        return Object.values(Permission);
      case UserRole.OPERATOR:
        return [
          Permission.READ_DEVICES,
          Permission.WRITE_DEVICES,
          Permission.READ_DATA,
          Permission.WRITE_DATA,
          Permission.READ_ALERTS,
          Permission.MANAGE_ALERTS
        ];
      case UserRole.VIEWER:
        return [
          Permission.READ_DEVICES,
          Permission.READ_DATA,
          Permission.READ_ALERTS
        ];
      default:
        return [];
    }
  }
}

export default new AuthService(); 