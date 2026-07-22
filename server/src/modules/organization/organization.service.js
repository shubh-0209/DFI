const organizationRepository = require('./organization.repository');
const { generateOrganizationId, generateOrganizationSlug } = require('./organization.utils');
const {
  ORGANIZATION_TYPE,
  VERIFICATION_STATUS,
  MESSAGES,
  ALLOWED_SORT_FIELDS,
  ALLOWED_SORT_ORDERS,
} = require('./organization.constants');
const User = require('../user/user.model');
const NotFoundError = require('../../utils/errors/NotFoundError');
const ValidationError = require('../../utils/errors/ValidationError');

class OrganizationService {
  async createOrganization(userId, organizationData) {
    const {
      name,
      shortName,
      description,
      logo,
      coverImage,
      email,
      phone,
      website,
      address,
      city,
      state,
      country,
      pincode,
      socialLinks,
      foundedYear,
      organizationType,
    } = organizationData;

    const organizationId = await generateOrganizationId();
    const slug = await generateOrganizationSlug(name);

    const existingByEmail = await organizationRepository.existsByEmail(email);
    if (existingByEmail) {
      throw new ValidationError(MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const existingBySlug = await organizationRepository.existsBySlug(slug);
    if (existingBySlug) {
      throw new ValidationError(MESSAGES.SLUG_ALREADY_EXISTS);
    }

    const organization = await organizationRepository.create({
      organizationId,
      slug,
      name,
      shortName,
      description,
      logo,
      coverImage,
      email,
      phone,
      website,
      address,
      city,
      state,
      country: country || 'India',
      pincode,
      socialLinks: socialLinks || {},
      foundedYear,
      organizationType: organizationType || null,
      verificationStatus: VERIFICATION_STATUS.PENDING,
      isActive: true,
      owner: userId,
      admins: [userId],
      createdBy: userId,
      updatedBy: userId,
    });

    return { organization };
  }

  async getOrganization(id, _userRole) {
    const organization = await organizationRepository.findById(id);

    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }

    return { organization };
  }

  async updateOrganization(userId, organizationId, updateData) {
    const organization = await organizationRepository.findByOrganizationId(organizationId);

    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }

    const isOwner = organization.owner.toString() === userId.toString();
    const isAdmin = organization.admins.some(
      (adminId) => adminId.toString() === userId.toString()
    );

    if (!isOwner && !isAdmin) {
      throw new ValidationError(MESSAGES.FORBIDDEN);
    }

    const {
      name,
      shortName,
      description,
      logo,
      coverImage,
      email,
      phone,
      website,
      address,
      city,
      state,
      country,
      pincode,
      socialLinks,
      foundedYear,
      organizationType,
      verificationStatus,
      isActive,
      admins,
    } = updateData;

    if (email && email !== organization.email) {
      const existingByEmail = await organizationRepository.existsByEmail(email, organization._id);
      if (existingByEmail) {
        throw new ValidationError(MESSAGES.EMAIL_ALREADY_EXISTS);
      }
    }

    if (name && name !== organization.name) {
      const newSlug = await generateOrganizationSlug(name);
      const existingBySlug = await organizationRepository.existsBySlug(newSlug, organization._id);
      if (existingBySlug) {
        throw new ValidationError(MESSAGES.SLUG_ALREADY_EXISTS);
      }
    }

    const updatedOrganization = await organizationRepository.update(organization._id, {
      ...(name !== undefined && { name }),
      ...(name !== undefined && { slug: await generateOrganizationSlug(name) }),
      ...(shortName !== undefined && { shortName }),
      ...(description !== undefined && { description }),
      ...(logo !== undefined && { logo }),
      ...(coverImage !== undefined && { coverImage }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(website !== undefined && { website }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(country !== undefined && { country }),
      ...(pincode !== undefined && { pincode }),
      ...(socialLinks !== undefined && { socialLinks }),
      ...(foundedYear !== undefined && { foundedYear }),
      ...(organizationType !== undefined && { organizationType }),
      ...(verificationStatus !== undefined && { verificationStatus }),
      ...(isActive !== undefined && { isActive }),
      ...(admins !== undefined && { admins }),
      updatedBy: userId,
    });

    return { organization: updatedOrganization };
  }

  async deleteOrganization(userId, organizationId) {
    const organization = await organizationRepository.findByOrganizationId(organizationId);

    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }

    if (organization.owner.toString() !== userId.toString()) {
      throw new ValidationError(MESSAGES.FORBIDDEN);
    }

    await organizationRepository.softDelete(organization._id, userId);

    return { organization };
  }

  async listOrganizations(queryParams) {
    const { page, limit, sortBy, sortOrder, organizationType, verificationStatus, isActive } =
      queryParams;

    const validPage = Math.max(1, parseInt(page, 10) || 1);
    const validLimit = Math.min(
      Math.max(1, parseInt(limit, 10) || 10),
      100
    );
    const validSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'desc';

    const filterQuery = {};
    if (organizationType && Object.values(ORGANIZATION_TYPE).includes(organizationType)) {
      filterQuery.organizationType = organizationType;
    }
    if (verificationStatus && Object.values(VERIFICATION_STATUS).includes(verificationStatus)) {
      filterQuery.verificationStatus = verificationStatus;
    }
    if (isActive !== undefined) {
      filterQuery.isActive = isActive;
    }

    const result = await organizationRepository.findAll(filterQuery, {
      page: validPage,
      limit: validLimit,
      sortBy: validSortBy,
      sortOrder: validSortOrder,
    });

    const totalPages = Math.ceil(result.total / validLimit);

    return {
      organizations: result.organizations,
      pagination: {
        total: result.total,
        page: validPage,
        limit: validLimit,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    };
  }

  async approveOrganization(adminId, organizationId, reviewNotes) {
    const organization = await organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }
    const updated = await organizationRepository.changeStatus(
      organization._id,
      VERIFICATION_STATUS.VERIFIED,
      adminId,
      reviewNotes
    );
    return { organization: updated, message: MESSAGES.ORGANIZATION_APPROVED };
  }

  async rejectOrganization(adminId, organizationId, rejectionReason, reviewNotes) {
    const organization = await organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }
    const updated = await organizationRepository.changeStatus(
      organization._id,
      VERIFICATION_STATUS.REJECTED,
      adminId,
      reviewNotes,
      rejectionReason
    );
    return { organization: updated, message: MESSAGES.ORGANIZATION_REJECTED };
  }

  async activateOrganization(userId, organizationId) {
    const organization = await organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }
    const updated = await organizationRepository.update(organization._id, {
      isActive: true,
      updatedBy: userId,
    });
    return { organization: updated, message: MESSAGES.ORGANIZATION_ACTIVATED };
  }

  async deactivateOrganization(userId, organizationId) {
    const organization = await organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }
    const updated = await organizationRepository.update(organization._id, {
      isActive: false,
      updatedBy: userId,
    });
    return { organization: updated, message: MESSAGES.ORGANIZATION_DEACTIVATED };
  }

  async archiveOrganization(userId, organizationId) {
    const organization = await organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }
    const updated = await organizationRepository.update(organization._id, {
      isActive: false,
      updatedBy: userId,
    });
    return { organization: updated, message: MESSAGES.ORGANIZATION_ARCHIVED };
  }

  async restoreOrganization(userId, organizationId) {
    const organization = await organizationRepository.restore(organizationId);
    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }
    const updated = await organizationRepository.update(organization._id, {
      isActive: true,
      updatedBy: userId,
    });
    return { organization: updated, message: MESSAGES.ORGANIZATION_RESTORED };
  }

  async assignAdmin(adminId, organizationId, userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }
    const updated = await organizationRepository.assignAdmin(organizationId, userId);
    return { organization: updated, message: MESSAGES.ADMIN_ASSIGNED };
  }

  async removeAdmin(adminId, organizationId, userId) {
    const updated = await organizationRepository.removeAdmin(organizationId, userId);
    return { organization: updated, message: MESSAGES.ADMIN_REMOVED };
  }

  async transferOwnership(adminId, organizationId, newOwnerId) {
    const organization = await organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundError(MESSAGES.ORGANIZATION_NOT_FOUND);
    }
    const user = await User.findById(newOwnerId);
    if (!user) {
      throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }
    const updated = await organizationRepository.transferOwnership(
      organization._id,
      newOwnerId,
      organization.owner
    );
    return { organization: updated, message: MESSAGES.OWNER_TRANSFERRED };
  }
}

module.exports = new OrganizationService();
