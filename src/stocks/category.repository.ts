import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async findOrCreateOne(name: string): Promise<Category> {
    let category = await this.findOne({ name });

    if (!category) {
      category = new Category();
      category.name = name;
      await category.save();
    }

    return category;
  }
}
