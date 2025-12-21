import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const FULL_CONTENT = `
Socializing is one of the most important factors in healthy aging. Maintaining a strong social network can improve mental health, boost cognitive function, and even increase longevity. However, meeting new people can sometimes feel challenging later in life.

If you are looking to expand your social circle, here are 11 great places where seniors can meet other seniors and build meaningful connections.

## 1. Adult Education or Lifelong Learning Programs
Many universities and community colleges offer "Lifelong Learning" programs specifically designed for seniors. These non-credit courses range from history and art to technology and current events. They are fantastic places to meet intellectually curious peers who share your interests. Look for Osher Lifelong Learning Institutes (OLLI) near you.

## 2. Senior Dating Apps
If you are single and looking for romance or companionship, dating apps designed for seniors are a great option. Platforms like **SilverSingles** and **OurTime** cater specifically to the 50+ demographic, making it easier to find someone in a similar stage of life.

## 3. Online Communities
The internet has made it easier than ever to connect with people from the comfort of your home. **Facebook Groups** focused on hobbies (like "Senior Gardeners" or "Over 60 Travel") are very active. Websites like **Stitch** are dedicated to helping older adults find companionship and activities, not just dating.

## 4. Senior Centers
Your local senior center is the classic hub for social interaction. Modern senior centers offer a wide array of activities, including card games, dance classes, computer workshops, and group lunches. It's a low-pressure environment to meet neighbors.

## 5. Volunteer Organizations
Volunteering is a powerful way to meet purpose-driven people. Whether it's at a local hospital, food bank, animal shelter, or museum, working alongside others for a common cause creates an instant bond.

## 6. Fitness Classes
Staying active is essential, and group fitness classes are a social way to do it. Look for **SilverSneakers** classes at local gyms, which are free with many Medicare plans. Walking clubs, water aerobics, and senior yoga are also excellent places to strike up a conversation.

## 7. Faith-Based Groups
Churches, synagogues, and other places of worship often have specific groups or ministries for seniors. These groups may organize potlucks, day trips, or bible studies, providing a supportive community foundation.

## 8. Travel Clubs
If you love to explore, consider joining a senior travel club. Group travel takes the stress out of planning and ensures you have built-in dinner companions. Companies like **Road Scholar** offer educational travel tours specifically for older adults.

## 9. Hobby Groups
Do you love knitting, woodworking, or playing chess? There is likely a club for that. Check your local library or community bulletin boards for meeting times. Shared passions are the best icebreakers.

## 10. Community Events
Keep an eye on your town's calendar. Farmers markets, free concerts in the park, and local festivals are bustling with people. Regular attendance at these events helps you become a familiar face in your neighborhood.

## 11. Part-Time Jobs
For many seniors, a part-time job isn't just about the money—it's about the social interaction. Working a few shifts at a bookstore, boutique, or consulting in your former field can keep you connected to the community and introduce you to new people of all ages.

### Conclusion
Meeting new people takes a little effort, but the rewards are well worth it. Pick one or two of these places to explore this week. You might just meet your new best friend!
`;

export async function GET() {
  try {
    const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Service key not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase
      .from('blog_posts')
      .upsert({
        slug: '11-places-seniors-meet-seniors',
        title: '11 Places Seniors Meet Seniors: Where Connection Happens',
        description: 'Looking to expand your social circle? Here are 11 great places where seniors can meet other seniors and build meaningful connections.',
        category: 'Senior Lifestyle',
        author: 'Guide for Seniors',
        published_at: new Date().toISOString(),
        read_time_minutes: 5,
        image_url: 'https://media.istockphoto.com/id/1355427063/photo/happy-mature-couples-talking-while-walking-in-autumn-day.jpg?s=612x612&w=0&k=20&c=OOnOH57ycbXOH7qUkI-suXytrKf0TOpFbA4qHh9_GkE=',
        content_markdown: FULL_CONTENT
      }, {
        onConflict: 'slug'
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      post: data[0],
      url: 'https://www.guideforseniors.com/blog/11-places-seniors-meet-seniors'
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
