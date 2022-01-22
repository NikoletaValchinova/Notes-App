import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { UserInterface } from '../models/user.interface';
import { UsersService } from '../services/users.service';


@Controller('users')
export class UsersController {
    
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async addUser(@Body() userDto: UserDto) {
        const generatedUser = await this.usersService.addUser(userDto);
        return generatedUser;
    }
    
    @Get()
    async getAllUsers(): Promise<UserInterface[]> {
        const users = await this.usersService.getAllUsers();
        return users;
    }

    @Post('/loggedUser') 
    async setLoggedUser(@Res() res, @Body() body: any) {
        const user = await this.usersService.setLoggedUser(body.email, body.password);
        if(!user) {
            return res
                .status(HttpStatus.NOT_FOUND)
                .json({ status: 404, error: "Not found!" });
        }
        return res
        .status(HttpStatus.OK)
        .json({data: user});
    }

    @Put('/loggedUser')
    async logoutUser(@Res() res, @Body() id: string) {
        this.usersService.logoutUser(id);

        return res.status(HttpStatus.OK).json({
            status: 200,
            message: 'Successful!',
        });
    }

    @Get('/loggedUser')
    async getLoggedUser(): Promise<UserInterface> {
        const user = await this.usersService.getLoggedUser();
        return user;
    }

    @Put(':id')
    async addFolderToUser(@Param('id') userId: string, @Body() userDto: UserDto) {
        const editedUser = await this.usersService.addFolderToUser(userId, userDto);
        return editedUser;
    }

    @Delete(':id')
    async deleteUser(@Res() res, @Param('id') userId: string) {
        const user = await this.usersService.deleteUser(userId);
        if (!user) {
            return res
                .status(HttpStatus.NOT_FOUND)
                .json({ status: 404, error: "Not found!" });
        }
        return res.status(HttpStatus.OK).json({
            status: 200,
            message: 'Successful!',
        });
    }

}
