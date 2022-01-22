import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { FolderDto } from '../dto/folder.dto';
import { FolderInterface } from '../models/folder.interface';


@Injectable()
export class FoldersService { 
    constructor(@InjectModel('Folder') private readonly folderModel: Model<FolderInterface>) {}
   
    async addFolder(folderDto: FolderDto): Promise<FolderInterface> {
        const newFolder = new this.folderModel(folderDto);
        const result = await newFolder.save();
        return result;
    }
    
    async getAllFolders(): Promise<FolderInterface[]> {
        return this.folderModel.find().exec();
    }
    
    async editFolder(folderId: string, folderDto: FolderDto) { 
        const folder = await this.folderModel.findById(folderId).exec();
    
        if (!folder) {
          throw new NotFoundException('Could not find folder.');
        }
        
        folder.title = folderDto.title;
        folder.notes = [...folderDto.notes];


        await folder.save();
        return this.folderModel.findById(folderId).exec();
    }

    async getSelectedFolder(folderId: string): Promise<FolderInterface> {
        const folder = await this.folderModel.findById(folderId).exec();
        return folder;
    }

    async deleteFolder(folderId: string): Promise<FolderInterface> {
        const folder = await this.folderModel.findByIdAndDelete(folderId).exec();
        return folder;
    }
}
