# Community Photo Upload Guide

## How to Upload Community Photos to Supabase

### Where to Upload

**Supabase Project:** `hncgnxbooghjhpncujzx` (guideforseniors)  
**Storage Bucket:** `community-images`  
**Supabase Dashboard:** https://supabase.com/dashboard/project/hncgnxbooghjhpncujzx/storage/buckets/community-images

### File Format & Specifications

**Format:** `.webp` (preferred) or `.jpeg/.jpg`  
**Resolution:** 1200-1600px wide (maintains quality, reasonable file size)  
**Aspect Ratio:** 16:9 or 4:3 works well  
**File Size:** Keep under 500KB for fast loading  

**Why .webp?**
- 25-35% smaller than JPEG with same quality
- Better for page load speed and SEO
- Supported by all modern browsers

### File Naming Convention

**Pattern:** `{community-name}-{city}-oh.webp`

**Rules:**
1. All lowercase
2. Remove everything after comma in community name
3. Remove phrases like "Assisted Living", "Memory Care", etc.
4. Replace spaces and special characters with hyphens
5. Remove multiple consecutive hyphens
6. Always end with `-{city}-oh.webp`

### Examples:

| Community Name | City | Filename |
|---|---|---|
| Rose Senior Living at Beachwood | Beachwood | `rose-senior-living-beachwood-oh.webp` |
| HarborChase of Shaker Heights | Shaker Heights | `harborchase-shaker-heights-oh.webp` |
| Brookdale Westlake Village, Westlake, OH - Assisted Living | Westlake | `brookdale-westlake-village-westlake-oh.webp` |
| The Grande at Westlake | Westlake | `grande-westlake-oh.webp` |
| O'Neill Healthcare Lakewood | Lakewood | `oneill-healthcare-lakewood-oh.webp` |

### Step-by-Step Upload Process

#### Option 1: Supabase Dashboard (Easiest)

1. Go to https://supabase.com/dashboard/project/hncgnxbooghjhpncujzx/storage/buckets/community-images
2. Click "Upload" button
3. Select your .webp files
4. Click "Upload"
5. Images are immediately available!

#### Option 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Upload file
supabase storage upload community-images/rose-senior-living-beachwood-oh.webp ./path/to/photo.webp --project-ref hncgnxbooghjhpncujzx
```

### After Uploading Photos

Once you upload a photo, you need to link it to the community in the database:

#### Update Database with Image URL

```sql
-- Replace {community_name} and {filename}
UPDATE "Community"
SET image_url = '/community-images/{filename}'
WHERE name LIKE '%{partial community name}%' 
  AND city = '{City}'
  AND image_url IS NULL;
```

**Example:**
```sql
UPDATE "Community"
SET image_url = '/community-images/brookdale-westlake-village-westlake-oh.webp'
WHERE name LIKE '%Brookdale%Westlake Village%' 
  AND image_url IS NULL;
```

### Where to Find Community Photos

**Best Sources:**

1. **Google Maps / Google Street View**
   - Search for community address
   - Look at user-uploaded photos
   - Use Street View for building exteriors

2. **Community Websites**
   - Most communities have photo galleries
   - Download high-res versions
   - Ensure you have rights to use (public marketing photos are generally OK)

3. **Facebook Pages**
   - Many communities post photos
   - Exterior shots, activity photos

4. **Yelp / Google Reviews**
   - User-uploaded photos often show real buildings

5. **Google Image Search**
   - Search: "{community name} {city} ohio"
   - Filter by usage rights if concerned

### Converting Images to .webp

**Online Tools:**
- https://squoosh.app/ (best quality control)
- https://cloudconvert.com/jpg-to-webp
- https://www.freeconvert.com/jpg-to-webp

**Command Line (if you have cwebp installed):**
```bash
cwebp input.jpg -o output.webp -q 85
```

### Quick Batch Upload Script

If you have many photos in a folder, you can use the matching script:

```bash
# Place all photos in a folder named with the pattern above
# Run the SQL matching script to update database
node scripts/match-images-sql.js
```

### Communities Currently Without Images (Top Priority)

See attached list below - these are Assisted Living/Memory Care communities in Cleveland area that would benefit most from real photos.

---

## Pro Tips

✅ **Start with homepage featured communities** - They get the most traffic  
✅ **Photograph exteriors** - More professional than interior shots  
✅ **Sunny day photos** - Look more inviting  
✅ **Include signage** - Helps users identify the building  
✅ **Compress images** - Faster page loads = better SEO  
✅ **Consistent naming** - Makes matching easier  

### Need Help?

The automated matching uses fuzzy logic based on community name and city, so as long as your filenames are close to the pattern above, the system will match them to the correct communities.

If you batch upload photos and want to run matching, use:
```bash
node scripts/match-images-sql.js
```

Or manually update via SQL as shown above.

