import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { RestaurantSettingsPublic } from '@alma-jardin/shared';
import {
  RestaurantSettings,
  RestaurantSettingsDocument,
} from '../schemas/restaurant-settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(RestaurantSettings.name)
    private readonly settingsModel: Model<RestaurantSettingsDocument>,
  ) {}

  async getPublic(): Promise<RestaurantSettingsPublic> {
    const settings = await this.ensureSettings();
    return this.toPublic(settings);
  }

  async update(data: Partial<RestaurantSettingsPublic>): Promise<RestaurantSettingsPublic> {
    const settings = await this.ensureSettings();
    Object.assign(settings, data);
    await settings.save();
    return this.toPublic(settings);
  }

  private async ensureSettings(): Promise<RestaurantSettingsDocument> {
    let settings = await this.settingsModel.findOne();

    if (!settings) {
      settings = await this.settingsModel.create({});
    }

    return settings;
  }

  private toPublic(settings: RestaurantSettingsDocument): RestaurantSettingsPublic {
    return {
      name: settings.name,
      tagline: settings.tagline,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      aboutText: settings.aboutText,
      address: settings.address,
      phone: settings.phone,
      whatsappPhone: settings.whatsappPhone,
      whatsappMessage: settings.whatsappMessage,
      email: settings.email,
      instagramUrl: settings.instagramUrl,
      openingHours: settings.openingHours,
      mapUrl: settings.mapUrl,
    };
  }
}
