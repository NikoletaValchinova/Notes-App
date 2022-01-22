import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';

import { FolderDto } from '../dto/folder.dto';
import { FolderInterface } from '../models/folder.interface';
import { FoldersService } from '../services/folders.service';

@Controller('folders')
export class FoldersController {
    
    constructor(private readonly foldersService: FoldersService) {}

    @Post()
    async addFolder(@Body() folderDto: FolderDto) {
        const generatedFolder = await this.foldersService.addFolder(folderDto);
        return generatedFolder;
    }
    
    @Get()
    async getAllFolders(): Promise<FolderInterface[]> {
        const folders = this.foldersService.getAllFolders();
        return folders;
    }

    @Get(':id')
    async getSelectedFolder(@Param('id') folderId: string, @Res() res: any) {
        const folder = await this.foldersService.getSelectedFolder(folderId);
        if (!folder) {
            return res
                .status(HttpStatus.NOT_FOUND)
                .json({ status: 404, error: "Not found!" });
        }
        
        return res
        .status(HttpStatus.OK)
        .json({data: folder});
    }

    @Put(':id')
    async editFolder(@Param('id') folderId: string, @Body() folderDto: FolderDto) {
        const editedFolder = await this.foldersService.editFolder(folderId, folderDto);
        return editedFolder;
    }

    @Delete(':id')
    async deleteFolder(@Res() res, @Param('id') folderId: string) {
        const folder = await this.foldersService.deleteFolder(folderId);
        if (!folder) {
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
