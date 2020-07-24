import { EntityRepository, Repository } from 'typeorm';
import { Subcategory } from './subcategory.entity';

@EntityRepository(Subcategory)
export class SubcategoryRepository extends Repository<Subcategory> {
  async findOrCreateOne(name = 'ETF'): Promise<Subcategory> {
    let subcategory = await this.findOne({ name });

    if (!subcategory) {
      subcategory = new Subcategory();
      subcategory.name = name;
      await subcategory.save();
    }

    return subcategory;
  }
}
