import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  auditStatus,
  clientPotential,
  clientType,
  kycStatus,
  regulations,
  retentionData,
  salesData,
  system,
  callResults,
  leads,
} from 'src/admin/client/constants/custom_status.constants';
import {
  CustomStatus,
  StatusType,
} from 'src/admin/client/entities/custom_status.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CreateSalesRetentionInfoSeedService {
  constructor(
    @InjectRepository(CustomStatus)
    private repository: Repository<CustomStatus>,
  ) {}

  async run() {
    const existingSalesRetention = await this.repository.find({
      where: { type: In(['sales', 'retention']) }, // Assuming 'sales' and 'retention' are existing types
    });

    const existingClientAudit = await this.repository.find({
      where: { type: In(['client_potential', 'audit_status']) }, // Assuming 'client_potential' and 'audit_status' are new types
    });

    const existingKyc = await this.repository.find({
      where: { type: In(['kyc_status']) }, // Assuming 'client_potential' and 'audit_status' are new types
    });

    const existingSystem = await this.repository.find({
      where: { type: In(['system']) }, // Assuming 'client_potential' and 'audit_status' are new types
    });

    const existingRegulationsAndClientType = await this.repository.find({
      where: { type: In(['regulations', 'client_type']) }, // Assuming 'client_potential' and 'audit_status' are new types
    });

    const existingCallResults = await this.repository.find({
      where: { type: In(['call_results']) }, // Assuming 'client_potential' and 'audit_status' are new types
    });

    const existingLeads = await this.repository.find({
      where: { type: In(['lead']) }, // Assuming 'client_potential' and 'audit_status' are new types
    });

    if (existingSalesRetention.length === 0) {
      await Promise.all(
        salesData.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'sales' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );

      await Promise.all(
        retentionData.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'retention' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );
    }

    if (existingClientAudit.length === 0) {
      await Promise.all(
        clientPotential.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'client_potential' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );

      await Promise.all(
        auditStatus.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'audit_status' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );
    }
    if (existingKyc.length === 0) {
      await Promise.all(
        kycStatus.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'kyc_status' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );
    }

    if (existingSystem.length === 0) {
      await Promise.all(
        system.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'system' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );
    }

    if (existingRegulationsAndClientType.length === 0) {
      await Promise.all(
        regulations.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'regulations' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );

      await Promise.all(
        clientType.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'client_type' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );
    }

    if (existingCallResults.length === 0) {
      await Promise.all(
        callResults.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'call_results' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );
    }

    if (existingLeads.length === 0) {
      await Promise.all(
        leads.map(async (name) => {
          await this.repository.save(
            this.repository.create({
              name,
              type: 'lead' as StatusType,
              sort: 0,
              is_hidden: false,
            }),
          );
        }),
      );
    }
  }
}
