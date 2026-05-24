import { CardsCarousel } from '@/components/CarouselPlugin/CardsCarousel';
import { getCategories } from '@/services/server/pruductService';


export default async function CategoriesCarousel() {
  const categories = await getCategories();
  const categoriesDocs = Array.isArray(categories?.data?.docs) ? categories.data.docs : [];

  console.log(categoriesDocs)


  return <CardsCarousel type="categories" data={categoriesDocs} />
}