import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { classifyLeadQuality, looksLikeHumanName } from './lead-quality';

describe('looksLikeHumanName', () => {
  it('accepts ordinary family names', () => {
    assert.equal(looksLikeHumanName('Janette Tuma'), true);
    assert.equal(looksLikeHumanName('Mary Ann McDonald'), true);
  });

  it('rejects gibberish and vowel-less tokens', () => {
    assert.equal(looksLikeHumanName('ddPPJqvSmScFTyaUqYl fISXzhFHjcHHomlaQcrmeORu'), false);
    assert.equal(looksLikeHumanName('Jzwh Sgatzp'), false);
  });
});

describe('classifyLeadQuality', () => {
  it('flags Janette as a likely family lead', () => {
    const result = classifyLeadQuality({
      fullName: 'Janette Tuma',
      email: 'janettetuma@hotmail.com',
      phone: '4406673625',
      notes: 'Community Inquiry: Do you accept Medicaid? | And do you allow your residents to smoke outside?',
      pageType: 'community_inquiry',
      communityName: 'Bickford of Rocky River',
    });
    assert.equal(result.quality, 'likely_family');
  });

  it('flags an Ohio phone plus a human name as family', () => {
    const result = classifyLeadQuality({
      fullName: 'Mary Smith',
      email: 'mary@example.com',
      phone: '2163217890',
      notes: 'Looking for assisted living for my mom',
      pageType: 'contact',
    });
    assert.equal(result.quality, 'likely_family');
  });

  it('marks Melotto / TurboJot as spam via the shared vendor phone', () => {
    const result = classifyLeadQuality({
      fullName: 'Hannah Melotto',
      email: 'hannah.melotto@melottogroup.com',
      phone: '2158218810',
      notes: 'Advisor consultation requested. Preferred contact: phone',
      pageType: 'advisor_request',
    });
    assert.equal(result.quality, 'likely_spam');
    assert.equal(result.reason, 'known_vendor_phone');
  });

  it('marks outreach copy as spam', () => {
    const result = classifyLeadQuality({
      fullName: 'Julia Miller',
      email: 'julia@turbojot.com',
      phone: '2158218810',
      notes: 'Have you tried TurboJot yet? It automates website form submissions across thousands of websites.',
      pageType: 'contact',
    });
    assert.equal(result.quality, 'likely_spam');
  });

  it('marks QA rows as spam', () => {
    const result = classifyLeadQuality({
      fullName: 'Mary Ann McDonald',
      email: 'qatest.gfs@gmail.com',
      phone: '2163038841',
      notes: 'QA verification after heuristic fix - please ignore',
      pageType: 'contact',
    });
    assert.equal(result.quality, 'likely_spam');
    assert.equal(result.reason, 'qa_test');
  });

  it('marks leftover Brunswick bot as spam', () => {
    const result = classifyLeadQuality({
      fullName: 'Jzwh Sgatzp',
      email: 'inonivoze.399@gmail.com',
      notes: 'Requested 2026 Brunswick Senior Care Cost Guide',
      pageType: 'location_page',
    });
    assert.equal(result.quality, 'likely_spam');
  });

  it('sends unnamed out-of-state humans to review, not the family inbox', () => {
    const result = classifyLeadQuality({
      fullName: 'Robert Allen',
      email: 'robert@example.com',
      phone: '6028091127',
      notes: '',
      pageType: 'contact',
    });
    assert.equal(result.quality, 'review');
  });
});
