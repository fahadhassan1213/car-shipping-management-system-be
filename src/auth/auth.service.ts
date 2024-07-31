import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { RolesService } from 'src/roles/roles.service';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common/exceptions';
import { CreateUserDto } from 'src/users/dto/users.dto';
import { UserWithRolesDetails } from './types/auth.types';

@Injectable()
export class AuthService {
  readonly saltRounds = process.env.BCRYPT_SALT_OR_ROUNDS;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
  ) {}

  // Validate user with username(Email) and password
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.usersService.user({ email });
      if (!user) {
        throw new Error('Incorrect Username or Password');
      }

      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      } else {
        throw new Error('Incorrect Password');
      }
    } catch (error) {
      throw new Error(error.message ? error.message : error);
    }
  }

  // Login user and return access token
  async userLogin(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    try {
      const user = (await this.usersService.user(
        {
          id: payload.sub,
        },
        {
          include: {
            roles: {
              include: {
                role: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      )) as UserWithRolesDetails;

      const isUser = user.roles.some((role) => role.role.name === 'user');

      if (!isUser) {
        throw new BadRequestException('Is not an user');
      }
      return {
        access_token: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  // Create new user
  async userRegister(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const { name, email, password } = data;
      // Encrypt the password
      const hash = await bcrypt.hash(password, parseInt(this.saltRounds));

      // Create new user
      const _user = await this.usersService.createUser({
        name,
        email,
        password: hash,
      });

      // Find the user role by name
      const newRole = await this.rolesService.createRoleDetails({
        name: 'user',
        description: 'User have access to their own profile',
      });

      // Create a user role for the new user
      await this.rolesService.createRole({
        user: { connect: { id: _user.id } },
        role: {
          connect: {
            id: newRole.id,
          },
        },
      });

      // Find the created user and return without the password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: pass, ...user } = await this.usersService.user(
        {
          id: _user.id,
        },
        {
          include: {
            roles: {
              select: {
                id: true,
                role: true,
              },
            },
          },
        },
      );
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new ConflictException('User email address already exist');
        }
      }
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(e.message);
      }
      // console.log('error ', e);
    }
  }

  // Login admin and return access token
  async adminLogin(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    try {
      const user = (await this.usersService.user(
        {
          id: payload.sub,
        },
        {
          include: {
            roles: {
              include: {
                role: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      )) as UserWithRolesDetails;
      const isAdmin = user.roles.some((role) => role.role.name === 'admin');

      if (!isAdmin) {
        throw new BadRequestException('User is not a admin');
      }
      return {
        access_token: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      throw error;
    }
  }
}
