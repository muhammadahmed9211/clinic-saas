import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Readable } from 'stream';

// Entities
import { User } from 'src/users/entities/user.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';

// Services
import { FilesService } from 'src/files/files.service';
import { UserKycDocumentsService } from 'src/user-kyc-docs/user-kyc-documents.service';
import { AdminKycService } from 'src/admin/kyc/kyc.service';
import { ClientsService } from 'src/users/clients.service';

// DTOs
import { CreateUserKycDocumentsDto } from 'src/user-kyc-docs/dto/user-kyc-documents.dto';
import { KycInfoDto } from 'src/admin/client/dto/clientKycInfo.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { MasterTaskService } from 'src/tasks/task.service';
import { SettingsService } from 'src/settings/settings.service';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { AccountService } from 'src/mt5/account/account.service';
import { ServerName } from 'src/wallet/entities/server.entity';
import { AccountTradingType } from 'src/mt5/account/dto/create-account.dto';
import { Mt5AccountRepository } from 'src/mt5/account/repositories/mt5-account.repository';

/**
 * ShuftiService
 *
 * Handles all Shufti Pro KYC verification operations including:
 * - Access token generation
 * - Verification request submission
 * - Webhook processing
 * - Document downloading and storage
 * - KYC status updates
 */
@Injectable()
export class ShuftiService {
  private readonly logger = new Logger(ShuftiService.name);

  // Constants
  private readonly ROLE_ID = 2;
  private readonly SHUFTI_FOLDER =
    this.configService.get<string>('shufti.awsBucket') || 'shufti-local-assets';

  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FilesService,
    private readonly userKycDocumentsService: UserKycDocumentsService,
    private readonly adminKycService: AdminKycService,
    private readonly clientsService: ClientsService,
    private readonly service: MasterTaskService,
    private readonly settingsService: SettingsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(required_kyc_documents)
    private required_kyc_documents: Repository<required_kyc_documents>,
    @InjectRepository(CustomStatus)
    private readonly customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(RejectedReason)
    private readonly rejectedReasonRepository: Repository<RejectedReason>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly mt5AccountService: AccountService,
    private readonly mt5AccountRepository: Mt5AccountRepository,
  ) {}

  // ==================== UTILITY METHODS ====================

  /**
   * Formats date string to YYYY-MM-DD format
   * @param dateString - ISO date string
   * @returns Formatted date string
   */

  // private formatDOB(dateString: string): string {
  //   if (!dateString) {
  //     return '';
  //   }
  //   return dateString.split('T')[0];
  // }

  /**
   * Extracts user ID from Shufti reference string
   * @param reference - Reference string in format "user_{id}_{timestamp}"
   * @returns User ID or null if invalid format
   */

  private extractUserId(reference: string): number | null {
    const userIdMatch = reference.match(/^user_(\d+)_\d+$/);
    if (!userIdMatch) {
      this.logger.error(`Invalid reference format: ${reference}`);
      return null;
    }
    return parseInt(userIdMatch[1], 10);
  }

  /**
   * Gets system user for automated operations
   * @returns System user entity
   * @throws BadRequestException if system user not found
   */

  private async getSystemUser(): Promise<User> {
    const systemUser = await this.userRepository.findOne({
      where: { operator: { full_name: 'System' } },
      relations: ['operator'],
    });

    if (!systemUser) {
      this.logger.error('System user not found in database');
      throw new BadRequestException('System user not found');
    }

    return systemUser;
  }

  // ==================== SHUFTI API METHODS ====================

  /**
   * Generates Shufti Pro access token
   * @returns Configuration object with access token and settings
   * @throws Error if token generation fails
   */

  async getShuftiAccessToken(isDarkMode?: boolean): Promise<{
    access_token: string;
    baseUrl: string;
    consent_age: number;
    active_liveness: boolean;
    icon_color?: string;
    theme_color?: string;
    card_background_color?: string;
    loader_color?: string;
    loader_text_color?: string;
    stroke_color?: string;
    dark_mode_enabled?: boolean;
  }> {
    const themeSettings = isDarkMode
      ? {
          loader_color: '#FFFFFF',
          loader_text_color: '#FFFFFF',
          dark_mode_enabled: true,
        }
      : {
          loader_color: '#593268',
          loader_text_color: '#593268',
        };
    try {
      const clientId = this.configService.get<string>('SHUFTI_CLIENT_ID');
      const secretKey = this.configService.get<string>('SHUFTI_SECRET_KEY');
      const baseUrl = this.configService.get<string>('SHUFTI_BASE_URL');

      // Create Basic Auth header
      const basicAuth = Buffer.from(`${clientId}:${secretKey}`).toString(
        'base64',
      );

      // Request access token
      const tokenResp = await axios.post(
        `${baseUrl}/get/access/token`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
          },
        },
      );

      const accessToken = tokenResp.data?.access_token;
      if (!accessToken) {
        throw new Error('Shufti access_token not received');
      }
      const response = {
        access_token: accessToken,
        baseUrl: baseUrl || '',
        consent_age: 18,
        active_liveness: true,
      };

      return { ...response, ...themeSettings };
    } catch (error: any) {
      this.logger.error(`Failed to get Shufti access token: ${error.message}`);
      throw new Error(`Shufti authentication failed: ${error.message}`);
    }
  }

  /**
   * Builds verification payload for Shufti Pro
   * @param user - User entity
   * @param lang - Language code
   * @param kycStep - KYC step type ('identity' or 'address')
   * @returns Verification payload object
   */
  async buildPayload(
    user: any,
    lang: string,
    kycStep: string,
    redirectUrl?: string,
  ): Promise<any> {
    const isIdentityStep = kycStep === 'identity';
    const isAddressStep = kycStep === 'address';
    const countriesResponse = await this.settingsService.getCountriesIso(lang);
    const countries = countriesResponse?.result || [];

    // Find matching country by nationality
    const matchedCountry = countries.find(
      (c: any) =>
        c.printableName?.toLowerCase() ===
        user?.client?.nationality?.toLowerCase(),
    );
    const baseRedirect =
      this.configService.get<string>('SHUFTI_REDIRECT_URL') || '';
    const finalRedirectUrl = redirectUrl
      ? `${baseRedirect}${redirectUrl.startsWith('/') ? '' : '/'}${redirectUrl}`
      : '';
    // Base payload
    const payload: any = {
      reference: `user_${user?.id}_${Date.now()}`,
      country: matchedCountry?.iso,
      language: lang,
      email: user?.email,
      callback_url: this.configService.get<string>('SHUFTI_CALLBACK_URL') || '',
      redirect_url: finalRedirectUrl,
      allow_warnings: '1',
      ttl: 60,
      force_mobile_redirect: '0',
      tel:
        user?.tel || `${user?.telephonePrefix || ''}${user?.telephone || ''}`,
    };

    // Add identity verification fields
    if (isIdentityStep) {
      payload.face = {
        proof_required: true,
        allow_offline: '0',
        allow_online: '1',
        verification_mode: 'any',
      };

      payload.document = {
        supported_types: ['id_card', 'driving_license', 'passport'],
        proof_required: true,
        extract_info: '1',
        fetch_enhanced_data: '1',
        show_ocr_form: 1,
        process_only_ocr: '0',
        backside_proof_required: '1',
        name: user?.fullName
          ? {
              full_name: user.fullName,
              fuzzy_match: '1',
            }
          : {
              first_name: user?.firstName,
              last_name: user?.lastName,
              fuzzy_match: '1',
            },
        // dob: this.formatDOB(user?.dob),
        age: {
          min: 18,
          max: 80,
        },
      };
    }

    // Add address verification fields
    if (isAddressStep) {
      payload.address = {
        address_fuzzy_match: '1',
        show_ocr_form: '1',
        address_proof_type: false,
        proof_required: false,
        supported_types: ['id_card', 'utility_bill', 'bank_statement'],
        full_address:
          user?.fullAddress || `${user?.address || ''}, ${user?.city || ''}`,
      };
    }

    return payload;
  }

  /**
   * Submits verification request to Shufti Pro
   * @param accessToken - Shufti access token
   * @param payload - Verification payload
   * @returns Verification response data
   * @throws Error if submission fails
   */
  async submitVerification(accessToken: string, payload: any): Promise<any> {
    try {
      const baseUrl = this.configService.get<string>('SHUFTI_BASE_URL');

      const verifyResp = await axios.post(`${baseUrl}/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return verifyResp.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          `Shufti verification submission failed: ${JSON.stringify(
            error.response?.data,
            null,
            2,
          )}`,
        );
      }
      throw new Error(`Verification submission failed: ${error.message}`);
    }
  }

  /**
   * Launches Shufti iframe for user verification
   * @param userId - User ID
   * @param lang - Language code
   * @param kycStep - KYC step type
   * @returns Verification response with iframe URL
   */
  async launchIframe(
    userId: any,
    lang: string,
    kycStep: string,
    redirectUrl?: string,
  ): Promise<any> {
    try {
      const config = await this.getShuftiAccessToken();
      const payload = await this.buildPayload(
        userId,
        lang,
        kycStep,
        redirectUrl,
      );
      const verification = await this.submitVerification(
        config.access_token,
        payload,
      );

      this.logger.log(`Iframe launched successfully for user: ${userId?.id}`);
      return verification;
    } catch (error: any) {
      this.logger.error(
        `Failed to launch iframe for user ${userId?.id}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Gets verification report from Shufti Pro
   * @param reference - Verification reference string
   * @returns Verification report data
   * @throws Error if report retrieval fails
   */
  async getVerificationReport(reference: string): Promise<any> {
    try {
      const clientId = this.configService.get<string>('SHUFTI_CLIENT_ID');
      const secretKey = this.configService.get<string>('SHUFTI_SECRET_KEY');
      const basicAuth = Buffer.from(`${clientId}:${secretKey}`).toString(
        'base64',
      );

      const resp = await axios.post(
        'https://api.shuftipro.com/status',
        { reference },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
          },
        },
      );

      return resp.data;
    } catch (error: any) {
      this.logger.error(
        `Error fetching report for ${reference}: ${JSON.stringify(
          error.response?.data,
          null,
          2,
        )}`,
      );
      throw new Error(`Failed to fetch verification report: ${error.message}`);
    }
  }

  // ==================== FILE HANDLING METHODS ====================

  /**
   * Downloads file from Shufti Pro as buffer
   * @param fileUrl - File URL to download
   * @param accessToken - Shufti access token
   * @returns Buffer and content type
   * @throws Error if download fails or file is too large
   */
  async downloadFileAsBuffer(
    fileUrl: string,
    accessToken: string,
  ): Promise<{ buffer: Buffer; contentType: string }> {
    try {
      const response = await axios.post(
        fileUrl,
        { access_token: accessToken },
        { responseType: 'arraybuffer' },
      );

      const contentType =
        response.headers['content-type'] || 'application/octet-stream';
      const buffer = Buffer.from(response.data);

      return { buffer, contentType };
    } catch (error: any) {
      this.logger.error(
        `Error downloading file from ${fileUrl}: ${error.message}`,
      );
      throw new Error(`File download failed: ${error.message}`);
    }
  }

  /**
   * Determines file extension from content type
   * @param contentType - MIME type
   * @returns File extension with dot
   */
  private getFileExtension(contentType: string): string {
    const extensionMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'application/pdf': '.pdf',
      'video/mp4': '.mp4',
    };

    return extensionMap[contentType] || '.file';
  }

  /**
   * Handles file download and upload to S3
   * @param fileUrl - File URL to download
   * @param key - File key/type
   * @param subKey - Sub-key for nested files
   * @param accessToken - Shufti access token
   * @param userId - User ID
   * @param userFolder - User's folder path
   * @returns Uploaded file entity or null if failed
   */
  private async handleFileUpload(
    fileUrl: string,
    key: string,
    subKey: string | undefined,
    accessToken: string,
    userId: number,
    userFolder: string,
  ): Promise<FileEntity | null> {
    try {
      // Download file as buffer
      const bufferResponse = await this.downloadFileAsBuffer(
        fileUrl,
        accessToken,
      );
      const ext = this.getFileExtension(bufferResponse.contentType);

      // Generate filename
      const filename = subKey
        ? `${
            this.SHUFTI_FOLDER
          }/${userFolder}/${key}_${subKey}_${Date.now()}${ext}`
        : `${this.SHUFTI_FOLDER}/${userFolder}/${key}_${Date.now()}${ext}`;

      // Create Multer file object
      const kycFile: Express.Multer.File = {
        buffer: bufferResponse.buffer,
        fieldname: key,
        originalname: filename,
        encoding: '7bit',
        mimetype: bufferResponse.contentType,
        size: bufferResponse.buffer.length,
        stream: Readable.from(bufferResponse.buffer),
        destination: '',
        filename: `${key}_${Date.now()}${ext}`,
        path: '',
      };

      // Upload to S3
      const uploaded = await this.fileService.updateToS3(
        kycFile,
        userId,
        this.ROLE_ID,
      );
      this.logger.log(`File uploaded successfully: ${filename}`);

      return uploaded;
    } catch (error: any) {
      this.logger.error(
        `Error uploading file (${key}${subKey ? '_' + subKey : ''}): ${
          error.message
        }`,
      );
      return null;
    }
  }

  // ==================== WEBHOOK PROCESSING ====================

  /**
   * Downloads all proof files from verification report
   * @param proofs - Proofs object from Shufti report
   * @param accessToken - Shufti access token
   * @param userId - User ID
   * @param userFolder - User's folder path
   * @returns Array of uploaded file entities
   */
  private async downloadAllProofFiles(
    proofs: any,
    accessToken: string,
    userId: number,
    userFolder: string,
  ): Promise<FileEntity[]> {
    const uploadedFiles: FileEntity[] = [];
    const downloadTasks: Promise<FileEntity | null>[] = [];

    // Loop over proofs object
    for (const [key, value] of Object.entries(proofs)) {
      // Skip access_token field
      if (key === 'access_token') continue;

      // Handle direct URL
      if (typeof value === 'string' && value.startsWith('http')) {
        downloadTasks.push(
          this.handleFileUpload(
            value,
            key,
            undefined,
            accessToken,
            userId,
            userFolder,
          ),
        );
      }

      // Handle nested object with URLs
      else if (typeof value === 'object' && value !== null) {
        for (const [subKey, subVal] of Object.entries(value)) {
          if (typeof subVal === 'string' && subVal.startsWith('http')) {
            downloadTasks.push(
              this.handleFileUpload(
                subVal,
                key,
                subKey,
                accessToken,
                userId,
                userFolder,
              ),
            );
          }
        }
      }
    }

    // Wait for all uploads to complete
    const results = await Promise.all(downloadTasks);

    // Filter out null results (failed uploads)
    results.forEach((file) => {
      if (file) {
        uploadedFiles.push(file);
      }
    });

    return uploadedFiles;
  }

  /**
   * Maps uploaded files to KYC document structure
   * @param uploadedFiles - Array of uploaded file entities
   * @param report - Verification report
   * @returns Array of KYC document DTOs
   */
  private mapFilesToKycDocuments(
    uploadedFiles: FileEntity[],
    report: any,
  ): CreateUserKycDocumentsDto[] {
    // Define mapping for file prefixes to document IDs and field IDs
    const prefixMap: Record<
      string,
      { documentId: number; getFieldId: () => string }
    > = {
      document: {
        documentId: 1,
        getFieldId: () =>
          report.verification_data?.document?.selected_type?.[0] || 'id_card',
      },
      address: {
        documentId: 2,
        getFieldId: () => 'other',
      },
      face: {
        documentId: 5,
        getFieldId: () => 'selfie',
      },
      verification: {
        documentId: 7,
        getFieldId: () => 'shufti_report',
      },
    };

    // Map files with metadata
    const mappedFiles = uploadedFiles.map((file) => {
      const prefix = file.fileName.split('_')[0].toLowerCase();
      const mapping = prefixMap[prefix] || {
        documentId: 0,
        getFieldId: () => 'unknown',
      };

      return {
        ...file,
        prefix,
        documentId: mapping.documentId,
        field_id: mapping.getFieldId(),
      };
    });

    // Group files by document ID
    const grouped: Record<number, typeof mappedFiles> = {};
    mappedFiles.forEach((file) => {
      if (!grouped[file.documentId]) {
        grouped[file.documentId] = [];
      }
      grouped[file.documentId].push(file);
    });

    // Create KYC documents with proper side assignment
    const kycDocuments: CreateUserKycDocumentsDto[] = [];
    Object.values(grouped).forEach((group) => {
      group.forEach((file, idx) => {
        kycDocuments.push({
          documentId: file.documentId,
          fileId: file.id,
          field_id: file.field_id,
          side: idx === 0 ? 'front' : 'back',
        });
      });
    });

    return kycDocuments;
  }

  /**
   * Updates KYC document details from verification proof
   * @param userId - User ID
   * @param proof - Document proof data
   * @param additionalProof - Additional document proof data
   * @param fieldId - Field ID
   * @param isDeclined - Whether verification was declined
   * @param declinedReason - Reason for decline
   * @param systemUserId - System user ID
   */
  private async updateKycDocumentDetails(
    userId: number,
    proof: any,
    additionalProof: any,
    fieldId: string,
    isDeclined: boolean,
    declinedReason: string,
    systemUserId: number,
  ): Promise<void> {
    try {
      // Get rejected reason if declined
      let rejectedReasonIds: number[] = [];
      let rejectedReasonOther = '';

      if (isDeclined) {
        const otherReason = await this.rejectedReasonRepository.findOne({
          where: { name: 'Other' },
        });

        if (otherReason) {
          rejectedReasonIds = [otherReason.id];
          rejectedReasonOther = declinedReason;
        }
      }

      // Build update DTO
      const updateDto = {
        fieldId: fieldId,
        userId: userId,
        idNumber: proof.document_number || additionalProof.document_number,
        nationality: proof.document_country || additionalProof.document_country,
        dateOfBirth: proof.dob || additionalProof.dob,
        documentExpiryDate: proof.expiry_date || additionalProof.expiry_date,
        rejectedReasonIds: rejectedReasonIds,
        rejectedReasonOther: rejectedReasonOther,
      };

      // Update document details
      await this.adminKycService.updateUserKycDocumentDetail(
        userId,
        updateDto as any,
        systemUserId,
      );

      this.logger.log(`KYC document details updated for user: ${userId}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to update KYC document details: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Updates KYC status for all user documents
   * @param userKycData - User KYC documents data
   * @param kycStatusName - Status name ('Approved' or 'Rejected')
   * @param systemUserId - System user ID
   */
  private async updateAllDocumentStatuses(
    userKycData: any[],
    kycStatusName: string,
    systemUserId: number,
    userDetails: JwtPayloadType,
  ): Promise<void> {
    try {
      for (const doc of userKycData) {
        const body = { documentId: doc.documentId };

        const kycInfoDto: KycInfoDto = {
          fieldId: doc.field_id,
          kycStatus: kycStatusName,
          type: 'kyc_status',
        };

        await this.userKycDocumentsService.updateClientKycInfo(
          +doc.userId,
          +doc.id,
          kycInfoDto,
          systemUserId,
        );
        console.log(doc.userId, doc.documentId, 'doc.userId,doc.id);');
        await this.service.createTaskCompleted(userDetails, body);
      }

      this.logger.log(`All document statuses updated to: ${kycStatusName}`);
    } catch (error: any) {
      this.logger.error(`Failed to update document statuses: ${error.message}`);
      throw error;
    }
  }

  /**
   * Updates overall KYC status for user
   * @param userId - User ID
   * @param kycStatusName - Status name
   * @param systemUserId - System user ID
   */
  private async updateUserKycStatus(
    userId: number,
    kycStatusName: string,
    systemUserId: number,
  ): Promise<void> {
    try {
      // Get status from database
      const kycStatusDetails = await this.customStatusRepository.findOne({
        where: { name: kycStatusName, type: 'kyc_status' as any },
      });

      if (!kycStatusDetails) {
        throw new Error(`KYC status '${kycStatusName}' not found`);
      }

      // Update user KYC status
      const kycUpdate = {
        kycStatus: kycStatusDetails.id,
      };

      const updateResult = await this.clientsService.updateClientKycInfo(
        userId,
        kycUpdate,
        systemUserId,
      );

      this.logger.log(
        `User KYC status updated to ${kycStatusName} for user: ${userId}`,
      );
    } catch (error: any) {
      this.logger.error(`Failed to update user KYC status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Processes Shufti webhook callback
   * @param payload - Webhook payload from Shufti
   * @returns Processing result with status and data
   */
  async processWebhook(payload: any): Promise<{
    status: string;
    message?: string;
    webhookPayload: any;
    shuftiReport: any;
    uploadedFiles: FileEntity[];
  }> {
    const reference = payload.reference;
    let report: any = null;
    const uploadedFiles: FileEntity[] = [];

    try {
      // Extract and validate user ID from reference
      const userId = this.extractUserId(reference);
      if (!userId) {
        return {
          status: 'error',
          message: 'Invalid reference format',
          webhookPayload: payload,
          shuftiReport: null,
          uploadedFiles: [],
        };
      }

      const userFolder = `userid-${userId}`;

      // Process only accepted or declined events
      if (
        !['verification.accepted', 'verification.declined'].includes(
          payload.event,
        )
      ) {
        this.logger.log(`Ignoring webhook event: ${payload.event}`);
        return {
          status: 'ignored',
          message: `Event ${payload.event} not processed`,
          webhookPayload: payload,
          shuftiReport: null,
          uploadedFiles: [],
        };
      }

      this.logger.log(`Processing webhook for reference: ${reference}`);

      // Get verification report
      report = await this.getVerificationReport(reference);

      if (!report?.proofs?.access_token) {
        throw new Error('Access token not found in verification report');
      }

      const accessToken = report.proofs.access_token;

      // Download all proof files
      const downloadedFiles = await this.downloadAllProofFiles(
        report.proofs,
        accessToken,
        userId,
        userFolder,
      );
      uploadedFiles.push(...downloadedFiles);

      // Map files to KYC documents
      const kycDocuments = this.mapFilesToKycDocuments(uploadedFiles, report);
      // Create KYC documents in database
      const userKyc = await this.userKycDocumentsService.createUserKycDocs(
        kycDocuments,
        userId,
        this.ROLE_ID,
      );

      // Get system user for automated operations
      const systemUser = await this.getSystemUser();

      // Determine verification status
      const isDeclined = payload.event === 'verification.declined';
      const declinedReason = payload.declined_reason || '';
      const kycStatusName = isDeclined ? 'Rejected' : 'Approved';

      // Extract proof data
      const proof = payload?.additional_data?.document?.proof || {};
      const additionalProof =
        payload?.additional_data?.document?.additional_proof || {};
      const userDetails =
        await this.userKycDocumentsService.getClientById(userId);
      await this.updateKycDocumentDetails(
        userId,
        proof,
        additionalProof,
        report.verification_data?.document?.selected_type?.[0] || 'other',
        isDeclined,
        declinedReason,
        systemUser.id,
      );
      await this.updateAllDocumentStatuses(
        userKyc?.data,
        kycStatusName,
        systemUser.id,
        userDetails as any,
      );

      if (kycStatusName === 'Approved' && userKyc?.data?.length) {
        const existingDocument = await this.required_kyc_documents.findOne({
          where: { name: 'Proof of Identity' },
        });

        if (existingDocument) {
          let createAccount = false;
          for (const doc of userKyc.data) {
            if (
              +doc.documentId === +existingDocument.id &&
              doc.side === 'front'
            ) {
              createAccount = true;
            }
          }

          if (createAccount) {
            //MT5 Account Creation
            const exisitngAccount = await this.mt5AccountRepository.find({
              where: {
                user: { id: userId },
                server: { name: ServerName.LIVE },
              },
            });
            if (exisitngAccount.length === 0) {
              const account = await this.mt5AccountService.createAccount(
                {
                  Server: ServerName.LIVE,
                  ClientID: userId.toString(),
                  Currency: 'USD',
                  Email: userDetails?.email ?? '',
                  TradingType: AccountTradingType.NORMAL,
                },
                userDetails as User,
                true, // bypassing checks for KYC completion
              );
              console.log(
                'MT5 Live Account creation process initiated for user:',
                userId,
              );
              createAccount = false;

              if (account?.result?.answer?.Login) {
                console.log(
                  `MT5 Live account created successfully on Shufti ID Verification for user: ${userId}, Account Login: ${account.result.answer.Login}`,
                );
              } else {
                console.log(
                  `MT5 Live account creation failed on Shufti ID Verification for user: ${userId}. Reason: ${account}`,
                );
              }
            }
          }
        }
      }

      await this.cacheManager.del(`get-me-api-${userId}`);

      if ((userDetails?.client?.completedSteps ?? 0) >= 3) {
        await this.updateUserKycStatus(userId, kycStatusName, systemUser.id);
      }

      this.logger.log(
        `Webhook processed successfully for reference: ${reference}`,
      );

      return {
        status: 'success',
        message: 'Webhook processed successfully',
        webhookPayload: payload,
        shuftiReport: report,
        uploadedFiles,
      };
    } catch (error: any) {
      this.logger.error(
        `Error processing webhook for ${reference}: ${error.message}`,
      );

      return {
        status: 'error',
        message: error.message,
        webhookPayload: payload,
        shuftiReport: report,
        uploadedFiles,
      };
    }
  }
}
