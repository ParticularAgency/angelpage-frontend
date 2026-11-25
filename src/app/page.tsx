import FaqSection from '@/components/seo/FaqSection';
import JsonLd from '@/components/seo/JsonLd';
import { HOME_FAQS, homeGraph } from '@/lib/seoSchema';
import HomePage from '@/views/homepage/home';

export default function Home() {
  return (
    <>
      <JsonLd data={homeGraph()} />
      <div className="homepage-main-wrapper">
        <HomePage />
      </div>
      <FaqSection items={HOME_FAQS} showAllLink />
    </>
  );
}
