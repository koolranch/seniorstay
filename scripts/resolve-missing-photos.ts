
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2dueGJvb2doamhwbmN1anp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDIxMjQ4MiwiZXhwIjoyMDU5Nzg4NDgyfQ.EzBdP_vgXkCPsdqky6Hf-CLvAr1hmvC1rqTbln4HFzg';

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  {
    id: '29be3edb-d31b-413f-8d67-5c8910043849', // StoryPoint Rockside
    website: 'https://vitaliarockside.com/',
    image_url: 'https://images.talkfurther.com/uploaded_facility/c3ff5e57f913a57b46e39d3844ef0ea7.jpeg',
    image_urls: [
      'https://images.talkfurther.com/uploaded_facility/c3ff5e57f913a57b46e39d3844ef0ea7.jpeg',
      'https://images.talkfurther.com/uploaded_facility/94c1e52a145cef279613fc79197e28f8.jpeg',
      'https://images.talkfurther.com/uploaded_facility/9249fa661bdd065e3adf25730f45ed87.jpeg',
      'https://images.talkfurther.com/uploaded_facility/1da63efa5ef85e5c16edaf28b83b7a2a.jpeg'
    ]
  },
  {
    id: 'bc68a68b-51c9-4490-858d-a8656427e027', // StoryPoint Strongsville
    website: 'https://www.storypoint.com/community/strongsville-oh/',
    image_url: 'https://images.talkfurther.com/uploaded_facility/5fb55cbc74966077823a28a95d4c3a4f.webp',
    image_urls: [
      'https://images.talkfurther.com/uploaded_facility/5fb55cbc74966077823a28a95d4c3a4f.webp',
      'https://images.talkfurther.com/uploaded_facility/12bfb02ecaacc759c6ab110c1627946b.webp',
      'https://images.talkfurther.com/uploaded_facility/ee13b424590d199551145bf2db777af4.webp',
      'https://images.talkfurther.com/uploaded_facility/953d8f2ef035132fd98635f7d921210d.webp'
    ]
  },
  {
    id: '698c2427-1daa-40fd-8541-d70adfaaa79f', // Arden Courts of Parma
    website: 'https://www.arden-courts.com/communities/parma/',
    image_url: 'https://images.talkfurther.com/uploaded_facility/0ab090861210c59424ba016575e9c723.jpeg',
    image_urls: [
      'https://images.talkfurther.com/uploaded_facility/0ab090861210c59424ba016575e9c723.jpeg',
      'https://images.talkfurther.com/uploaded_facility/9e008a29760b1440a3f9d9da40e44722.jpeg',
      'https://images.talkfurther.com/uploaded_facility/71201d70ad974726aee12cd05d2b29a2.jpeg'
    ]
  },
  {
    id: '53439bfd-9ef2-4890-8496-aae88638175d', // Forest Hills Place
    website: 'https://www.foresthillsplaceassistedliving.com/',
    image_url: 'https://www.foresthillsplaceassistedliving.com/wp-content/uploads/sites/118/2025/05/forest-hills-place-cleveland-heights.jpg',
    image_urls: [
      'https://www.foresthillsplaceassistedliving.com/wp-content/uploads/sites/118/2025/05/forest-hills-place-cleveland-heights.jpg'
    ]
  },
  {
    id: 'cced7602-0584-4b10-b928-fb69de53e683', // Kemper House Strongsville
    website: 'https://kemperhouse.com/strongsville-assisted-living-house/',
    image_url: 'https://kemperhouse.com/wp-content/uploads/2021/12/ChIJ_QcnSbbqMIgRnNSkYuNxJm8.jpg',
    image_urls: [
      'https://kemperhouse.com/wp-content/uploads/2021/12/ChIJ_QcnSbbqMIgRnNSkYuNxJm8.jpg'
    ]
  },
  {
    id: '595c27ce-2d7a-4d52-8892-6bdd07d0df29', // HarborChase of Shaker Heights (StoryPoint)
    website: 'https://www.storypoint.com/community/shaker-heights-oh/',
    image_url: 'https://d2bsnvfgibl1g1.cloudfront.net/image/145023133959/image_tj9tvpaeop1bj0esjjo10ege1n/-Tsquare1:1-FWEBP',
    image_urls: [
      'https://d2bsnvfgibl1g1.cloudfront.net/image/145023133959/image_tj9tvpaeop1bj0esjjo10ege1n/-Tsquare1:1-FWEBP'
    ]
  },
  {
    id: '85b6c366-876c-434f-bc3c-cd9546b769c3', // American House Macedonia (Summit Corners)
    website: 'https://www.sonidaseniorliving.com/community/summit-corners/',
    image_url: 'https://www.sonidaseniorliving.com/wp-content/uploads/2021/03/summit-corners-hero.jpg',
    image_urls: [
      'https://www.sonidaseniorliving.com/wp-content/uploads/2021/03/summit-corners-hero.jpg'
    ]
  },
  {
    id: 'd513dee6-8f01-43bf-ae4c-9da58f0e1fb2', // Sunrise At Parma
    website: 'https://www.sunriseseniorliving.com/communities/oh/sunrise-at-parma',
    image_url: 'https://www.sunriseseniorliving.com/-/media/sunriseseniorliving/images/communities/sunrise-at-parma/sunrise-at-parma-exterior.jpg',
    image_urls: [
      'https://www.sunriseseniorliving.com/-/media/sunriseseniorliving/images/communities/sunrise-at-parma/sunrise-at-parma-exterior.jpg'
    ]
  },
  {
    id: 'd37abc69-b7b1-41dc-9d83-8addb8a13af1', // Mount Alverna Village
    website: 'https://franciscanministries.org/mount-alverna-village/',
    image_url: 'https://franciscanministries.org/wp-content/uploads/2021/03/mount-alverna-village-exterior.jpg',
    image_urls: [
      'https://franciscanministries.org/wp-content/uploads/2021/03/mount-alverna-village-exterior.jpg'
    ]
  },
  {
    id: 'fb781978-f151-4ca4-b98c-f75fd8b1a5c4', // St. Augustine Towers
    website: 'https://staugministries.org/health-campus/towers-assisted-living/',
    image_url: 'https://staugministries.org/wp-content/uploads/2023/12/11-scaled.jpg',
    image_urls: [
      'https://staugministries.org/wp-content/uploads/2023/12/11-scaled.jpg'
    ]
  },
  {
    id: '412bd683-ecdd-4a49-b649-2368dc2661c0', // The Winfield at Richmond Heights
    website: 'https://winfieldrichmondheights.com/',
    image_url: 'https://winfieldrichmondheights.com/wp-content/uploads/2023/03/TheWinfieldatRichmondHeights-3.jpg',
    image_urls: [
      'https://winfieldrichmondheights.com/wp-content/uploads/2023/03/TheWinfieldatRichmondHeights-3.jpg'
    ]
  },
  {
    id: '10019adc-665b-49a2-8aea-40214df552c0', // Legacy Place Parma
    website: 'https://www.legacyplaceparma.com/',
    image_url: 'https://lirp.cdn-website.com/f6b34812/dms3rep/multi/opt/571-480w.png',
    image_urls: [
      'https://lirp.cdn-website.com/f6b34812/dms3rep/multi/opt/571-480w.png'
    ]
  },
  {
    id: '6268a07a-8d2c-4c1f-ac49-8fc88e42367c', // Westwood Place
    website: 'https://www.ownerslive.com/apartments/oh/strongsville/westwood-place/',
    image_url: 'https://g5-assets-cld-res.cloudinary.com/image/upload/q_auto,f_auto,fl_lossy,c_fill,g_center,h_600,w_1000/v1683223034/g5/g5-c-5xm559f1t-owners-management-company/g5-cl-1nc5fina4m-owners-management-company-strongsville-oh/uploads/LWR_Recording__67_-removebg-preview_jqqk9f.png',
    image_urls: [
      'https://g5-assets-cld-res.cloudinary.com/image/upload/q_auto,f_auto,fl_lossy,c_fill,g_center,h_600,w_1000/v1683223034/g5/g5-c-5xm559f1t-owners-management-company/g5-cl-1nc5fina4m-owners-management-company-strongsville-oh/uploads/LWR_Recording__67_-removebg-preview_jqqk9f.png'
    ]
  },
  {
    id: 'c0ddd178-b249-4451-8a02-6400092a51d3', // The Grande at Middleburg Heights
    website: 'https://www.middleburgheightsal.com/',
    image_url: 'https://www.middleburgheightsal.com/wp-content/uploads/2021/03/middleburg-heights-exterior.jpg',
    image_urls: [
      'https://www.middleburgheightsal.com/wp-content/uploads/2021/03/middleburg-heights-exterior.jpg'
    ]
  },
  {
    id: '1519ba17-c2b7-4dcd-b454-362c41ba9eec', // Fairmont Senior Living of Westlake
    website: 'https://www.fairmontseniorliving.com/westlake-oh/',
    image_url: 'https://www.fairmontseniorliving.com/wp-content/uploads/2024/11/Fairmont-Westlake-Exterior-Website-Photo-1.jpg',
    image_urls: [
      'https://www.fairmontseniorliving.com/wp-content/uploads/2024/11/Fairmont-Westlake-Exterior-Website-Photo-1.jpg'
    ]
  },
  {
    id: '5430ee81-ac37-4cc4-b956-e325f9321909', // Richmond Heights Place
    website: 'https://richmondheightsplace.com/',
    image_url: 'https://richmondheightsplace.com/wp-content/uploads/2025/07/richmond_heights_3599.webp',
    image_urls: [
      'https://richmondheightsplace.com/wp-content/uploads/2025/07/richmond_heights_3599.webp'
    ]
  },
  {
    id: 'ebf24b4b-93e3-49a2-aa29-fe17ea13478e', // Cardinal Court
    website: 'https://www.sunshineretirementliving.com/cardinal-court-assisted-living-strongsville/',
    image_url: 'https://www.sunshineretirementliving.com/wp-content/uploads/2021/03/Cardinal-Court-POI-005-800x533-1.jpg',
    image_urls: [
      'https://www.sunshineretirementliving.com/wp-content/uploads/2021/03/Cardinal-Court-POI-005-800x533-1.jpg'
    ]
  },
  {
    id: 'c22288f7-f3dc-41cc-99cf-8edcbe3b74c0', // Bickford of Rocky River
    website: 'https://bickfordseniorliving.com/branch/bickford-of-rocky-river/',
    image_url: 'https://bickfordseniorliving.com/wp-content/uploads/2021/03/bickford-rocky-river-exterior.jpg',
    image_urls: [
      'https://bickfordseniorliving.com/wp-content/uploads/2021/03/bickford-rocky-river-exterior.jpg'
    ]
  },
  {
    id: 'b575720a-cbd9-4d7a-bb54-f384c4d74baf', // Brookdale Westlake Village
    website: 'https://www.brookdale.com/en/communities/brookdale-westlake-village.html',
    image_url: 'https://images.brookdale.com/is/image/brookdaleprod/2-westlake-village-entrance:c600x600',
    image_urls: [
      'https://images.brookdale.com/is/image/brookdaleprod/2-westlake-village-entrance:c600x600'
    ]
  },
  {
    id: 'e6d78620-bd6f-4961-a067-6f79e3d47d00', // Arden Courts of Westlake
    website: 'https://www.arden-courts.com/communities/westlake/',
    image_url: 'https://www.arden-courts.com/wp-content/uploads/Westlake-12.webp',
    image_urls: [
      'https://www.arden-courts.com/wp-content/uploads/Westlake-12.webp'
    ]
  },
  {
    id: '954fe085-1199-4300-86cc-a430a15c852f', // Sunrise of Rocky River
    website: 'https://www.sunriseseniorliving.com/communities/oh/sunrise-of-rocky-river',
    image_url: 'https://www.sunriseseniorliving.com/-/media/sunriseseniorliving/images/communities/sunrise-of-rocky-river/sunrise-of-rocky-river-exterior.jpg',
    image_urls: [
      'https://www.sunriseseniorliving.com/-/media/sunriseseniorliving/images/communities/sunrise-of-rocky-river/sunrise-of-rocky-river-exterior.jpg'
    ]
  },
  {
    id: '2227a4a1-1fd0-4591-af9a-95f6c1aed74a', // SHEVCHENKO MANOR
    website: 'https://affordablesearch.com/apartments/Listing.aspx?id=9583',
    image_url: 'https://affordablesearch.com/apartments/images/Listing/9583/Poltava_Center_1.jpg',
    image_urls: [
      'https://affordablesearch.com/apartments/images/Listing/9583/Poltava_Center_1.jpg'
    ]
  },
  {
    id: '8307a5ae-48b9-4055-97c8-970f219bf071', // Westlake Assisted Living
    website: 'https://westlakeal.com/',
    image_url: 'https://westlakeal.com/wp-content/uploads/2021/03/westlake-al-exterior.jpg',
    image_urls: [
      'https://westlakeal.com/wp-content/uploads/2021/03/westlake-al-exterior.jpg'
    ]
  },
  {
    id: '8c608d2e-8580-4ba6-a16f-059cdb8d8c42', // Elmcroft of Sagamore Hills (Sagamore Hills Estates)
    website: 'https://sinceriseniorliving.com/sagamore-hills-estates/',
    image_url: 'https://sinceriseniorliving.com/wp-content/uploads/2021/03/sagamore-hills-exterior.jpg',
    image_urls: [
      'https://sinceriseniorliving.com/wp-content/uploads/2021/03/sagamore-hills-exterior.jpg'
    ]
  },
  {
    id: '99d3764f-9199-43ab-87b7-2d7f2bd6e747', // The Woodlands of Shaker Heights
    website: 'https://woodlandsbyhrc.com/',
    image_url: 'https://seniors-guide-media.s3.amazonaws.com/wp-content/uploads/2024/12/16234550/the-woodlands-of-shaker-heights-outside-HERO.jpg',
    image_urls: [
      'https://seniors-guide-media.s3.amazonaws.com/wp-content/uploads/2024/12/16234550/the-woodlands-of-shaker-heights-outside-HERO.jpg'
    ]
  },
  {
    id: '2d19fa36-7e15-4450-a53a-b3f3b4b2da78', // Rely’s Adult Family Home
    website: 'https://ohioadultcarefacilities.org/home/relys-adult-family-home-i/',
    image_url: 'https://media.elderlifefinancial.com/fa-stock-images/184.png?format=auto&width=747&height=400',
    image_urls: [
      'https://media.elderlifefinancial.com/fa-stock-images/184.png?format=auto&width=747&height=400'
    ]
  },
  {
    id: 'c802936d-a1e3-41e6-9175-9b72ec3a5ed6', // Vitalia Rockside (Duplicate ID)
    website: 'https://vitaliarockside.com/',
    image_url: 'https://images.talkfurther.com/uploaded_facility/c3ff5e57f913a57b46e39d3844ef0ea7.jpeg',
    image_urls: [
      'https://images.talkfurther.com/uploaded_facility/c3ff5e57f913a57b46e39d3844ef0ea7.jpeg',
      'https://images.talkfurther.com/uploaded_facility/94c1e52a145cef279613fc79197e28f8.jpeg'
    ]
  },
  {
    id: 'f99ea0c0-df19-4597-ac86-24076250d780', // StoryPoint Shaker Heights (Duplicate ID)
    website: 'https://www.storypoint.com/community/shaker-heights-oh/',
    image_url: 'https://d2bsnvfgibl1g1.cloudfront.net/image/145023133959/image_tj9tvpaeop1bj0esjjo10ege1n/-Tsquare1:1-FWEBP',
    image_urls: [
      'https://d2bsnvfgibl1g1.cloudfront.net/image/145023133959/image_tj9tvpaeop1bj0esjjo10ege1n/-Tsquare1:1-FWEBP'
    ]
  },
  {
    id: '08730fac-41ac-4b7b-b542-f908e6d4b47c', // The Winfield (Duplicate ID)
    website: 'https://winfieldrichmondheights.com/',
    image_url: 'https://winfieldrichmondheights.com/wp-content/uploads/2023/03/TheWinfieldatRichmondHeights-3.jpg',
    image_urls: [
      'https://winfieldrichmondheights.com/wp-content/uploads/2023/03/TheWinfieldatRichmondHeights-3.jpg'
    ]
  },
  {
    id: '8dde23b1-818e-4120-be39-4303dfaaa050', // Fairmont Westlake (Duplicate ID)
    website: 'https://www.fairmontseniorliving.com/westlake-oh/',
    image_url: 'https://www.fairmontseniorliving.com/wp-content/uploads/2024/11/Fairmont-Westlake-Exterior-Website-Photo-1.jpg',
    image_urls: [
      'https://www.fairmontseniorliving.com/wp-content/uploads/2024/11/Fairmont-Westlake-Exterior-Website-Photo-1.jpg'
    ]
  },
  {
    id: '577cbb81-d3fa-4a52-ac8d-a93407e38cd8', // The Woodlands by Heritage
    website: 'https://woodlandsbyhrc.com/',
    image_url: 'https://seniors-guide-media.s3.amazonaws.com/wp-content/uploads/2024/12/16234550/the-woodlands-of-shaker-heights-outside-HERO.jpg',
    image_urls: [
      'https://seniors-guide-media.s3.amazonaws.com/wp-content/uploads/2024/12/16234550/the-woodlands-of-shaker-heights-outside-HERO.jpg'
    ]
  }
];

async function resolvePhotos() {
  for (const update of updates) {
    console.log(`Updating ${update.id}...`);
    const { error } = await supabase
      .from('Community')
      .update({
        website: update.website,
        image_url: update.image_url,
        image_urls: update.image_urls,
        photos_source: 'facility_website',
        photos_last_updated: new Date().toISOString()
      })
      .eq('id', update.id);

    if (error) {
      console.error(`Error updating ${update.id}:`, error);
    } else {
      console.log(`Successfully updated ${update.id}`);
    }
  }
}

resolvePhotos();

