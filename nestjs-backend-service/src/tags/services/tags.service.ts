import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { TagInterface } from '../models/tag.interface';

@Injectable()
export class TagsService {
    constructor(@InjectModel("Tag") private readonly tagModel: Model<TagInterface>) {}

    async addTag(tagDto: any): Promise<TagInterface> {
        const newTag = new this.tagModel(tagDto);
        const result = await newTag.save();
        return  result;
    }
    async getAllTags(): Promise<TagInterface[]> {
        return this.tagModel.find().exec();
    }

    async deleteTag(tagId: string) {
        const tag = await this.tagModel.findByIdAndDelete(tagId).exec();
        return tag;
    }


}
