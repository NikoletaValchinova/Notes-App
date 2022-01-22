import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { UserDto } from '../dto/user.dto';
import { UserInterface } from '../models/user.interface';

@Injectable()
export class UsersService { 
    loggedUser: UserInterface;

    constructor(@InjectModel('User') private readonly userModel: Model<UserInterface>) {}
   
    async addUser(userDto: UserDto): Promise<UserInterface> {
        const newUser = new this.userModel(userDto);
        const result = await newUser.save();
        return result;
    }
    
    async getAllUsers(): Promise<UserInterface[]> {
        return this.userModel.find().exec();
    }

    async logoutUser(userId: string) {
        const user = null;
        this.loggedUser = null;
        await user.save();
        return user;
    }
    
    async addFolderToUser(userId: string, userDto: UserDto) { 
        const user = await this.userModel.findById(userId).exec();
    
        if (!user) {
          throw new NotFoundException('Could not find user.');
        }
        
        user.folders = [...userDto.folders];

        await user.save();
        return user;
    }

    async getLoggedUser(): Promise<UserInterface> {
        return this.loggedUser;
    }

    async setLoggedUser(email: string, password: string) {
        const user = await this.userModel.findOne({ email })
        this.loggedUser = user;
        if(!user) {
            return;
        }
        await user.save();
        return user;
    }

    async deleteUser(userId: string): Promise<UserInterface> {
        const user = await this.userModel.findByIdAndRemove(userId).exec();
        return user;
    }
}
