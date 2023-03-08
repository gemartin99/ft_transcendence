// import { IsNotEmpty, IsNumber, Min } from "class-validator";
// import { IsNotBlank } from "src/decorators/is-not-blank.decorator";

// export class CreateUserDto {

//     @IsString()
//     @IsNotBlank({message: 'UserName can\'t be blank'})
//     @MaxLenght(10, {message: 'UserName Max lenght is 10 characters'})
//     name?: string;

//     @IsString()
//     avatar?: string;

//     @IsBoolean()
//     @Transform(({ obj, key }) => obj[key] === 'true')
//     twofactor?: boolean;

//     @IsNumber()
//     score?: number;

//     @IsNumber()
//     played?: number;

//     @IsNumber()
//     wins?: number;

//     @IsNumber()
//     losses?: number;
// }