import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneById(id: bigint) {
    return this.userRepository.findById(id);
  }

}