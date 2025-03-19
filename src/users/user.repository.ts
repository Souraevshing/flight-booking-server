/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos/user.dto';

@Injectable()
export class UserRepository {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URI') || '',
      this.configService.get<string>('SUPABASE_SERVICE_KEY') || '',
    );
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    const { data, error } = await this.supabase.from('users').select('*');

    if (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }

    return data;
  }

  async findUserById(id: string): Promise<UserResponseDto | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      } // no users
      throw new Error(`Error fetching user: ${error.message}`);
    }

    return data;
  }

  async findUserByEmail(email: string): Promise<UserResponseDto | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }

    return data;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userData = {
      email: createUserDto.email,
      first_name: createUserDto.firstName,
      last_name: createUserDto.lastName,
      role: createUserDto.role,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data, error } = await this.supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw new Error(`Error creating user: ${error.message}`);

    return data;
  }

  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    const updateData: any = {};

    if (updateUserDto.firstName !== undefined) {
      updateData.first_name = updateUserDto.firstName;
    }

    if (updateUserDto.lastName !== undefined) {
      updateData.last_name = updateUserDto.lastName;
    }

    if (updateUserDto.role !== undefined) {
      updateData.role = updateUserDto.role;
    }

    updateData.updated_at = new Date();

    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Error updating user: ${error.message}`);
    return data;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const { error } = await this.supabase.from('users').delete().eq('id', id);

    if (error) throw new Error(`Error deleting user: ${error.message}`);
    return true;
  }

  async getAllUsers() {
    const { data, error } = await this.supabase.auth.admin.listUsers();

    if (error) {
      console.error('Error listing users:', error.message);
      throw new Error(`Error listing users: ${error.message}`);
    }

    return data;
  }
}
