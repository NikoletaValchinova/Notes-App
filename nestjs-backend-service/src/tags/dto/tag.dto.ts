import { IsNotEmpty, IsString } from "class-validator";

export class TagDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly color: string;
}