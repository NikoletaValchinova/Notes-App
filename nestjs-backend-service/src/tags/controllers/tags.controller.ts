import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';

import { TagDto } from '../dto/tag.dto';
import { TagInterface } from '../models/tag.interface';
import { TagsService } from '../services/tags.service';

@Controller('tags')
export class TagsController {
    
    constructor(private readonly tagsService: TagsService) {}
  
    @Post()
    async addTag(@Body() tagDto: TagDto) {
        const generatedTag = await this.tagsService.addTag(tagDto);
        return generatedTag;
    }
    
    @Get()
    async getAllNotes(): Promise<TagInterface[]> {
        const tags =  this.tagsService.getAllTags();
        return tags;
    }

    @Delete(':id')
    async deleteTag(@Res() res, @Param('id') tagId: string) {
        const tag = await this.tagsService.deleteTag(tagId);

        if (!tag) {
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
