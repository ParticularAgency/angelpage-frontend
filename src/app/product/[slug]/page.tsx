import ProductSingleSec from '@/components/product/ProductSingleSec';
import { isMongoObjectId } from '@/lib/slugs';
import { fetchProductDetails, type ProductRecord } from '@/lib/server-api';
import HydrateQuery from '@/store/HydrateQuery';
import { redirect } from 'next/navigation';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const ProductView = ProductSingleSec as React.FC<{
  productSlug?: string;
  initialProduct?: ProductRecord | null;
}>;

export default async function ProductSinglePage({ params }: PageProps) {
  const { slug } = await params;
  const initialProduct = await fetchProductDetails(slug);

  if (
    initialProduct?.slug &&
    isMongoObjectId(slug) &&
    slug !== initialProduct.slug
  ) {
    redirect(`/product/${initialProduct.slug}`);
  }

  const querySlug = initialProduct?.slug || slug;

  return (
    <div className="product-singlepage-wrapper">
      {initialProduct ? (
        <HydrateQuery
          entries={[
            {
              endpointName: 'getProductDetails',
              arg: querySlug,
              data: initialProduct,
            },
          ]}
        />
      ) : null}
      <ProductView productSlug={querySlug} initialProduct={initialProduct} />
    </div>
  );
}
