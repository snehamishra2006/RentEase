import property1 from '../assets/Property1.jpg';
import property2 from '../assets/Property2.jpg.avif';
import property3 from '../assets/Property3.webp';
import property4 from '../assets/Property4.avif';
import property5 from '../assets/Property5.webp';

export { property1, property2, property3, property4, property5 };

export const resolvePropertyImage = (imgUrl, fallbackIndex = 0) => {
  if (!imgUrl) {
    const fallbacks = [property1, property2, property3, property4, property5];
    return fallbacks[fallbackIndex % fallbacks.length];
  }

  if (typeof imgUrl === 'string') {
    if (imgUrl.includes('Property1') || imgUrl.includes('property1')) return property1;
    if (imgUrl.includes('Property2') || imgUrl.includes('property2')) return property2;
    if (imgUrl.includes('Property3') || imgUrl.includes('property3')) return property3;
    if (imgUrl.includes('Property4') || imgUrl.includes('property4')) return property4;
    if (imgUrl.includes('Property5') || imgUrl.includes('property5')) return property5;
  }

  return imgUrl;
};
