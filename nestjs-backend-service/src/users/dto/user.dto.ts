import { IsArray, isNotEmpty, IsNotEmpty, IsString, Length, ValidateNested } from 'class-validator';
import { FolderInterface } from 'src/folders/models/folder.interface';

export class UserDto {
    readonly name: string;
    
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @Length(6, 20, {message: 'Password should be at least 6 symbols'})
    @IsNotEmpty()
    readonly password: string;
    
    @ValidateNested()
    @IsArray()
    readonly folders: FolderInterface[];
  }