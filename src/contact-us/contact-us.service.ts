import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class ContactUsService {
  private readonly sanityProjectId = process.env.SANITY_PROJECT_ID;
  private readonly sanityDataset = process.env.SANITY_DATASET;
  private readonly sanityToken = process.env.SANITY_API_TOKEN;

  private buildSanityImageUrl(assetId?: string): string | null {
    if (!assetId) return null;
    let parts = assetId.replace(/^image-/, '').split('-');
    const ext = parts.pop();
    if (!ext) return null;
    const fileName = `${parts.join('-')}.${ext}`;
    return `https://cdn.sanity.io/images/${this.sanityProjectId}/${this.sanityDataset}/${fileName}`;
  }

  async getContactPage(language: string) {
    const lang = language?.toLowerCase() || 'en';
    const slugPrefix = lang === 'ar' ? '/ae-ar/contact-us/' : '/contact-us/';
    
    const query = `*[_type == 'contact-page' && slug.current == '${slugPrefix}']`;
    const url = `https://${this.sanityProjectId}.api.sanity.io/v2023-05-03/data/query/${this.sanityDataset}?query=${encodeURIComponent(
      query,
    )}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.sanityToken}`,
        },
      });
      const sanityData = await response.json();
      
      if (!sanityData?.result || sanityData.result.length === 0) {
        return null;
      }
      
      const pageData = sanityData.result[0];
      const address = pageData.addresses?.[0] || {};
      
      const addressBlock = address?.address?.[0];
      let Address = '';
      
      if (addressBlock?.children && Array.isArray(addressBlock.children)) {
        const spans = addressBlock.children
          .map(child => child?.text || '')
          .filter(text => text.trim());
        
        if (lang === 'ar' && spans.length > 1) {
          Address = spans.join('\n');
        } else {
          Address = spans.join(' ');
        }
      }
      
      const result = {
        key: 'contact-us',
        data: {
          heading: pageData.tabs[0].mainHeading + pageData.tabs[0].title,
          description: pageData.descriptions || '',
          mapUrl: address?.mapsImage?.mapsUrl || '',
          mapImage: this.buildSanityImageUrl(address?.mapsImage?.asset?._ref),
          title: address?.heading || '',
          subtitle: address?.subHeading || '',
          address: Address,
          phone: address?.phone || '',
          mail: address?.mail || '',
        },
      };
      
      return result;
    } catch (err) {
      throw new InternalServerErrorException('Error fetching data from Sanity');
    }
  }
}