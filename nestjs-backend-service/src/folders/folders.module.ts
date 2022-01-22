import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Folder, FolderSchema } from 'src/folders/schemas/folder.schema';
import { FoldersController } from './controllers/folders.controller';
import { FoldersService } from './services/folders.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }])],
    controllers: [FoldersController],
    providers: [FoldersService]
})
export class FoldersModule {}
