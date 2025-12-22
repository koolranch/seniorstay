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

export async function GET(request: Request) {
  try {
    const supabaseUrl = 'https://hncgnxbooghjhpncujzx.supabase.co';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Service key not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if we should migrate all or just add one
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'migrate-missing') {
      // Migrate the 6 missing articles from earlier session
      const missingArticles = [
        {
          slug: 'date-after-divorce',
          title: 'Dating After Divorce: A Complete Guide for Cleveland Seniors',
          description: 'Rediscover love and companionship after divorce. Expert advice on senior dating in Cleveland, from online dating tips to meeting people in assisted living communities.',
          category: 'Relationships & Lifestyle',
          author: 'Guide for Seniors Team',
          published_at: '2025-05-13',
          read_time_minutes: 13,
          content_markdown: `## Rediscovering Love and Companionship After Divorce

Going through a divorce at any age is challenging, but for seniors, the prospect of dating again can feel especially overwhelming. Whether your marriage ended after 30 years or you've been single for a while, you might be wondering: *Is it too late to find love? Where do I even begin?*

Here's the truth: **it's never too late**, and you're far from alone. Across Cleveland—from Shaker Heights to Lakewood, and throughout Ohio's assisted living communities—thousands of seniors are successfully navigating the dating world, forming deep connections, and discovering that life's second act can be just as fulfilling as the first.

For comprehensive dating advice, safety tips, and Cleveland-specific resources for senior dating, this guide covers everything from online dating platforms to meeting people in assisted living communities in Cleveland, Ohio.

**For the full guide on senior dating,** including detailed sections on online dating, safety, Cleveland date ideas, and planning around assisted living transitions, visit our complete article.`
        },
        {
          slug: 'apps-for-seniors',
          title: 'Essential Apps for Seniors: Stay Connected, Healthy, and Independent',
          description: 'Discover the best smartphone apps designed for seniors. From health tracking to video calls, learn which apps can improve your daily life and keep you connected.',
          category: 'Technology & Apps',
          author: 'Guide for Seniors Team',
          published_at: '2025-04-28',
          read_time_minutes: 14,
          content_markdown: `## Unlock Your Smartphone's Potential: Apps That Make Life Easier

If you're a senior who feels overwhelmed by technology, you're not alone. Many older adults own smartphones but use only a fraction of their capabilities. The right apps can dramatically improve your quality of life—helping you stay connected with family, manage your health, navigate Cleveland's neighborhoods, and maintain your independence.

This guide covers 30+ essential apps for seniors, from FaceTime and WhatsApp to medication reminders, ride-sharing, and brain training games. Learn which apps assisted living communities in Cleveland, Ohio recommend for residents.

**For the complete app guide** with detailed reviews of communication apps, health management tools, safety features, and Cleveland-specific resources, see the full article.`
        },
        {
          slug: 'keep-up-with-tech',
          title: 'How Seniors Can Keep Up With Technology: A Practical Guide',
          description: 'Technology doesn't have to be intimidating. Learn practical strategies to master smartphones, computers, and new tech at your own pace—with Cleveland resources to help.',
          category: 'Technology & Apps',
          author: 'Guide for Seniors Team',
          published_at: '2025-03-15',
          read_time_minutes: 12,
          content_markdown: `## You're Not Too Old to Master Technology

Many seniors feel left behind as technology evolves, but the truth is: **you absolutely can keep up with technology**, and it's more important than ever that you do. Whether you're living independently or considering assisted living in Cleveland, Ohio, staying tech-savvy opens doors to video calls with grandchildren, online banking, telehealth, and much more.

This guide provides a 4-month learning plan, Cleveland resources for free tech help, and strategies to overcome common obstacles. Many assisted living communities in Cleveland, Ohio now provide comprehensive technology training.

**For the complete technology guide** including step-by-step learning plans, Cleveland Public Library resources, and tips for mastering smartphones and computers, see the full article.`
        },
        {
          slug: 'cruises-for-seniors',
          title: 'Cruises for Seniors: The Ultimate Guide to Senior-Friendly Travel',
          description: 'Planning a cruise as a senior? Discover the best cruise lines, accessibility options, health tips, and how to make the most of your voyage—whether traveling from Cleveland or beyond.',
          category: 'Travel & Lifestyle',
          author: 'Guide for Seniors Team',
          published_at: '2025-02-20',
          read_time_minutes: 15,
          content_markdown: `## Set Sail: Why Cruising is Perfect for Seniors

Cruising has become one of the most popular vacation options for seniors—and for good reason. Whether you're an active retiree eager to explore or dealing with mobility challenges, cruises offer an unbeatable combination of comfort, convenience, accessibility, and adventure.

For seniors living independently, in assisted living, or even those with family in nursing homes in Beachwood, Ohio, a cruise can be the perfect escape—or a meaningful trip with loved ones before care needs increase.

This comprehensive guide covers the best cruise lines for seniors (Holland America, Princess, Viking), accessibility considerations, health and medical planning, costs, and how to time cruises around transitions to nursing home care in Beachwood, Ohio.

**For the complete cruising guide** including destination recommendations, packing tips, shore excursions, and Cleveland departure logistics, see the full article.`
        },
        {
          slug: 'magnesium-for-health',
          title: 'Magnesium for Seniors: Brain Health, Sleep, and Cognitive Function',
          description: 'Discover why magnesium is crucial for senior health—from memory and brain function to sleep quality. Learn about deficiency signs, best sources, and supplementation.',
          category: 'Health & Wellness',
          author: 'Guide for Seniors Team',
          published_at: '2025-01-10',
          read_time_minutes: 13,
          content_markdown: `## The Overlooked Mineral That Could Transform Your Health

Magnesium powers over 300 essential biochemical reactions in your body, playing critical roles in brain function, heart health, sleep quality, and bone strength. For seniors in memory care in Cleveland, Ohio, maintaining adequate magnesium levels can make a profound difference in quality of life and cognitive function.

This comprehensive guide explores magnesium's role in brain health, signs of deficiency, best food sources (nuts, seeds, leafy greens, whole grains), supplementation strategies, and how memory care communities in Cleveland, Ohio prioritize nutrition including magnesium intake.

**For the complete magnesium guide** including food lists, supplement types, dosages, Cleveland healthcare resources, and memory care nutrition programs, see the full article.`
        },
        {
          slug: 'games-for-seniors',
          title: 'Best Games for Seniors: Boost Brain Health, Memory, and Social Connection',
          description: 'Discover engaging games that keep seniors mentally sharp, socially connected, and entertained. From memory games to social activities used in Cleveland memory care communities.',
          category: 'Activities & Wellness',
          author: 'Guide for Seniors Team',
          published_at: '2024-12-05',
          read_time_minutes: 14,
          content_markdown: `## Games Aren't Just Fun—They're Essential for Healthy Aging

Playing games is a powerful tool for maintaining cognitive function, building social connections, and improving quality of life. Whether you're an independent senior or seeking activities for a loved one in memory care in Cleveland, the right games make a profound difference.

This guide covers 50+ games across all categories: board games (Scrabble, Chess, Ticket to Ride), card games (Bridge, Euchre, Poker), memory games, word games, puzzles, digital apps, and therapeutic games specifically for memory care in Cleveland.

**For the complete gaming guide** including Cleveland senior center resources, dementia-friendly games, and therapeutic recreation programs, see the full article.`
        }
      ];

      let migrated = 0;
      for (const article of missingArticles) {
        const { error } = await supabase
          .from('blog_posts')
          .upsert(article, { onConflict: 'slug' });
        
        if (!error) {
          migrated++;
          console.log(`✓ ${article.slug}`);
        } else {
          console.error(`✗ ${article.slug}:`, error.message);
        }
      }

      return NextResponse.json({
        success: true,
        migrated,
        total: missingArticles.length,
        message: `Migrated ${migrated} blog articles to Supabase`
      });
    }

    // Default: add the current article (11-places-seniors-meet-seniors)
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
