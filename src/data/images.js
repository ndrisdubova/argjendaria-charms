const unsplash = (id, w = 900) =>
  `https://images.unsplash.com/${id}?fm=jpg&q=70&w=${w}&auto=format&fit=crop`

export const hero = unsplash('photo-1692211813384-c673d6dad806', 1920)
export const story = unsplash('photo-1754573433744-bf2b79d0eaf4', 1200)

export const categoryImages = {
  ring: unsplash('photo-1775652138507-17280f2a59a4'),
  necklace: unsplash('photo-1506630448388-4e683c67ddb0'),
  earrings: unsplash('photo-1638734205377-f21045bf6ebe'),
  bracelet: unsplash('photo-1681091639085-c6d0f85e39a3'),
}

export function resolveProductImage(product) {
  return product.image || categoryImages[product.category] || categoryImages.ring
}

export default categoryImages
