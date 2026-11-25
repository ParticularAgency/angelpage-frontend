import Script from 'next/script';
import { GA_MEASUREMENT_ID, GTM_ID } from '@/lib/siteSeo';
import AnalyticsPageView from './AnalyticsPageView';

export default function GoogleTags() {
  return (
    <>
      <Script id="angelpage-gtm" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){
w[l]=w[l]||[];
w.gtag=function(){w[l].push(arguments);};
var saved=null;
try{saved=JSON.parse(localStorage.getItem('angelpage-cookie-consent')||'null');}catch(e){}
var analytics=saved&&saved.analytics?'granted':'denied';
var ads=saved&&saved.marketing?'granted':'denied';
w.gtag('consent','default',{
  ad_storage:ads,
  ad_user_data:ads,
  ad_personalization:ads,
  analytics_storage:analytics,
  functionality_storage:'granted',
  security_storage:'granted',
  wait_for_update:500
});
w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="angelpage-ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="Google Tag Manager"
        />
      </noscript>
      <AnalyticsPageView />
    </>
  );
}
