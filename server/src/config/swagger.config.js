const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Disha for India — API',
      version: '1.0.0',
      description: `
## Disha for India — Backend REST API

This is the official API documentation for the **Disha for India** volunteer management platform.

### Authentication
Most endpoints require a **JWT Bearer Token**.

1. Use **POST /api/v1/auth/register** to create an account.
2. Use **POST /api/v1/auth/login** to obtain an \`accessToken\`.
3. Click the **Authorize 🔓** button above and paste: \`Bearer <your_accessToken>\`.
4. All protected endpoints will now include the token automatically.

### Rate Limits
| Endpoint Group      | Limit             |
|---------------------|-------------------|
| Login / Register    | 5 requests / 15 min |
| Forgot Password     | 3 requests / 1 hour |
| Global API          | 100 requests / 15 min (production only) |
      `,
      contact: {
        name: 'Disha for India Engineering Team',
        email: 'tech@dishaforindia.org',
        url: 'https://dishaforindia.org',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Local Development Server',
      },
      {
        url: 'https://api.dishaforindia.org',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token. Example: **Bearer eyJhbGci...**',
        },
      },
      schemas: {
        // ─── User ───────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdef',
            },
            volunteerId: {
              type: 'string',
              example: 'DISHA000001',
            },
            name: {
              type: 'string',
              example: 'Arjun Mehta',
            },
            username: {
              type: 'string',
              example: 'arjun_mehta',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'arjun.mehta@disha.org',
            },
            phone: {
              type: 'string',
              example: '+919876543210',
            },
            role: {
              type: 'string',
              enum: ['guest', 'volunteer', 'coordinator', 'admin', 'superadmin'],
              example: 'volunteer',
            },
            status: {
              type: 'string',
              enum: ['pending', 'active', 'inactive', 'suspended'],
              example: 'active',
            },
            profilePhoto: {
              type: 'string',
              example: 'https://res.cloudinary.com/disha/image/upload/v1/photo.jpg',
            },
            about: {
              type: 'string',
              example: 'Passionate about social impact and education.',
            },
            college: {
              type: 'string',
              example: 'IIT Delhi',
            },
            course: {
              type: 'string',
              example: 'B.Tech Computer Science',
            },
            city: {
              type: 'string',
              example: 'New Delhi',
            },
            state: {
              type: 'string',
              example: 'Delhi',
            },
            skills: {
              type: 'array',
              items: { type: 'string' },
              example: ['Teaching', 'React', 'Node.js'],
            },
            points: {
              type: 'integer',
              example: 120,
            },
            hoursCompleted: {
              type: 'number',
              example: 34.5,
            },
            programsCompleted: {
              type: 'integer',
              example: 3,
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-30T04:00:00.000Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-30T04:00:00.000Z',
            },
          },
        },

        // ─── Request Bodies ──────────────────────────────────────
        RegisterRequest: {
          type: 'object',
          required: ['name', 'username', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Arjun Mehta',
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              example: 'arjun_mehta',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'arjun.mehta@disha.org',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'SecurePass123!',
            },
            phone: {
              type: 'string',
              example: '+919876543210',
            },
          },
        },

        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'arjun.mehta@disha.org',
              description: 'Provide either email or username',
            },
            username: {
              type: 'string',
              example: 'arjun_mehta',
              description: 'Provide either email or username',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePass123!',
            },
          },
        },

        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'arjun.mehta@disha.org',
            },
          },
        },

        ResetPasswordRequest: {
          type: 'object',
          required: ['password', 'confirmPassword'],
          properties: {
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'NewSecurePass456!',
            },
            confirmPassword: {
              type: 'string',
              format: 'password',
              example: 'NewSecurePass456!',
            },
          },
        },

        // ─── User Module Request Bodies ──────────────────────────
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100, example: 'Arjun Mehta' },
            username: { type: 'string', minLength: 3, maxLength: 30, example: 'arjun_mehta' },
            phone: { type: 'string', example: '+919876543210' },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other', 'prefer_not_to_say'],
              example: 'male',
            },
            dateOfBirth: { type: 'string', format: 'date', example: '2000-04-15' },
            college: { type: 'string', example: 'IIT Delhi' },
            course: { type: 'string', example: 'B.Tech Computer Science' },
            graduationYear: { type: 'integer', example: 2022 },
            educationLevel: { type: 'string', example: 'Graduate' },
            city: { type: 'string', example: 'New Delhi' },
            state: { type: 'string', example: 'Delhi' },
            country: { type: 'string', example: 'India' },
            about: { type: 'string', maxLength: 500, example: 'Passionate about social impact.' },
            skills: { type: 'array', items: { type: 'string' }, example: ['Teaching', 'React'] },
            languages: { type: 'array', items: { type: 'string' }, example: ['English', 'Hindi'] },
            interests: { type: 'array', items: { type: 'string' }, example: ['Education'] },
            availability: { type: 'array', items: { type: 'string' }, example: ['Weekends'] },
            linkedin: { type: 'string', example: 'https://linkedin.com/in/arjunmehta' },
            portfolio: { type: 'string', example: 'https://arjunmehta.dev' },
          },
        },

        // ─── Responses ───────────────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully.' },
            data: { type: 'object' },
          },
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred.' },
          },
        },

        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation Failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Valid email is required' },
                },
              },
            },
          },
        },

        AuthenticationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Access token is missing. Please log in.' },
          },
        },

        RateLimitError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: {
              type: 'string',
              example: 'Too many requests from this IP. Please try again after 15 minutes.',
            },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdef',
            },
            notificationId: {
              type: 'string',
              example: 'NTF-MXQ3K7-RANDOM',
            },
            recipient: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdeg',
            },
            sender: {
              type: 'string',
              nullable: true,
              example: '665f1b2c3d4e5f6789abcdeh',
            },
            title: {
              type: 'string',
              example: 'New application received',
            },
            message: {
              type: 'string',
              example: 'Your application for Beach Cleanup Drive has been received.',
            },
            type: {
              type: 'string',
              enum: ['application', 'program', 'attendance', 'certificate', 'reward', 'leaderboard', 'system', 'announcement'],
              example: 'application',
            },
            category: {
              type: 'string',
              example: 'general',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              example: 'medium',
            },
            channel: {
              type: 'string',
              enum: ['in-app', 'email', 'sms', 'push'],
              example: 'in-app',
            },
            relatedEntityType: {
              type: 'string',
              nullable: true,
              example: 'application',
            },
            relatedEntityId: {
              type: 'string',
              nullable: true,
              example: '665f1b2c3d4e5f6789abcdei',
            },
            isRead: {
              type: 'boolean',
              example: false,
            },
            readAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-06-30T04:00:00.000Z',
            },
            scheduledFor: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-07-01T04:00:00.000Z',
            },
            sentAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-06-30T04:00:00.000Z',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-07-07T04:00:00.000Z',
            },
            metadata: {
              type: 'object',
              example: {},
            },
            status: {
              type: 'string',
              enum: ['pending', 'sent', 'failed', 'scheduled'],
              example: 'pending',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-01T00:00:00.000Z',
            },
          },
        },
        NotificationsResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Notifications retrieved successfully' },
            data: {
              type: 'object',
              properties: {
                notifications: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Notification' },
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    total: { type: 'integer', example: 25 },
                    totalPages: { type: 'integer', example: 3 },
                  },
                },
              },
            },
          },
        },
        UnreadCountResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Unread count retrieved successfully' },
            data: {
              type: 'object',
              properties: {
                count: { type: 'integer', example: 5 },
              },
            },
          },
        },
        NotificationPreference: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdef',
            },
            user: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdeg',
            },
            inAppEnabled: {
              type: 'boolean',
              example: true,
            },
            emailEnabled: {
              type: 'boolean',
              example: false,
            },
            pushEnabled: {
              type: 'boolean',
              example: false,
            },
            smsEnabled: {
              type: 'boolean',
              example: false,
            },
            types: {
              type: 'object',
              properties: {
                application: { type: 'boolean', example: true },
                program: { type: 'boolean', example: true },
                attendance: { type: 'boolean', example: true },
                certificate: { type: 'boolean', example: true },
                reward: { type: 'boolean', example: true },
                leaderboard: { type: 'boolean', example: true },
                system: { type: 'boolean', example: true },
                announcement: { type: 'boolean', example: true },
              },
            },
            quietHours: {
              type: 'object',
              nullable: true,
              properties: {
                enabled: { type: 'boolean', example: false },
                startTime: { type: 'string', example: '22:00' },
                endTime: { type: 'string', example: '08:00' },
              },
            },
            digestFrequency: {
              type: 'string',
              enum: ['instant', 'daily', 'weekly'],
              example: 'instant',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        NotificationPreferenceUpdate: {
           type: 'object',
           properties: {
             inAppEnabled: { type: 'boolean', example: true },
             emailEnabled: { type: 'boolean', example: false },
             pushEnabled: { type: 'boolean', example: false },
             smsEnabled: { type: 'boolean', example: false },
             types: {
               type: 'object',
               example: {
                 application: true,
                 program: true,
                 attendance: false,
                 certificate: true,
                 reward: true,
                 leaderboard: true,
                 system: true,
                 announcement: true,
               },
             },
             quietHours: {
               type: 'object',
               properties: {
                 enabled: { type: 'boolean', example: false },
                 startTime: { type: 'string', example: '22:00' },
                 endTime: { type: 'string', example: '08:00' },
               },
             },
             digestFrequency: {
               type: 'string',
               enum: ['instant', 'daily', 'weekly'],
               example: 'instant',
             },
           },
         },
        Announcement: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdef0',
            },
            announcementId: {
              type: 'string',
              example: 'ANN-MXQ3K7-ABCD',
            },
            title: {
              type: 'string',
              example: 'Summer Volunteer Drive 2026',
            },
            message: {
              type: 'string',
              example: 'We are launching our annual summer volunteer drive...',
            },
            type: {
              type: 'string',
              enum: ['general', 'program', 'emergency', 'maintenance', 'event', 'recruitment', 'system'],
              example: 'recruitment',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              example: 'high',
            },
            targetAudience: {
              type: 'string',
              enum: ['all_users', 'volunteers', 'ngos', 'admins', 'specific_users'],
              example: 'all_users',
            },
            specificUsers: {
              type: 'array',
              items: { type: 'string' },
              example: ['665f1b2c3d4e5f6789abcdeg'],
            },
            scheduledAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-07-10T00:00:00.000Z',
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-07-10T00:00:00.000Z',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-07-31T23:59:59.000Z',
            },
            createdBy: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdeh',
            },
            updatedBy: {
              type: 'string',
              nullable: true,
              example: '665f1b2c3d4e5f6789abcdeh',
            },
            attachments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'brochure.pdf' },
                  url: { type: 'string', example: 'https://dishaforindia.org/files/brochure.pdf' },
                  type: { type: 'string', example: 'file' },
                  size: { type: 'integer', example: 1048576 },
                },
              },
              example: [],
            },
            status: {
              type: 'string',
              enum: ['draft', 'scheduled', 'published', 'expired', 'archived'],
              example: 'published',
            },
            isDeleted: {
              type: 'boolean',
              example: false,
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            deletedBy: {
              type: 'string',
              nullable: true,
            },
            metadata: {
              type: 'object',
              example: {},
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-05T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-05T00:00:00.000Z',
            },
          },
        },
        AnnouncementsResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Announcements retrieved successfully' },
            data: {
              type: 'object',
              properties: {
                announcements: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Announcement' },
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    total: { type: 'integer', example: 25 },
                    totalPages: { type: 'integer', example: 3 },
                  },
                },
              },
            },
          },
        },
        AnnouncementCreateRequest: {
          type: 'object',
          required: ['title', 'message'],
          properties: {
            title: {
              type: 'string',
              maxLength: 255,
              example: 'Summer Volunteer Drive 2026',
            },
            message: {
              type: 'string',
              maxLength: 2000,
              example: 'We are launching our annual summer volunteer drive...',
            },
            type: {
              type: 'string',
              enum: ['general', 'program', 'emergency', 'maintenance', 'event', 'recruitment', 'system'],
              example: 'recruitment',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              example: 'high',
            },
            targetAudience: {
              type: 'string',
              enum: ['all_users', 'volunteers', 'ngos', 'admins', 'specific_users'],
              example: 'all_users',
            },
            specificUsers: {
              type: 'array',
              items: { type: 'string' },
              example: ['665f1b2c3d4e5f6789abcdeg'],
            },
            scheduledAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-10T00:00:00.000Z',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-31T23:59:59.000Z',
            },
            attachments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'brochure.pdf' },
                  url: { type: 'string', example: 'https://dishaforindia.org/files/brochure.pdf' },
                  type: { type: 'string', default: 'file' },
                  size: { type: 'integer', example: 1048576 },
                },
              },
            },
            status: {
              type: 'string',
              enum: ['draft', 'scheduled', 'published', 'expired', 'archived'],
              example: 'draft',
            },
          },
        },
        AnnouncementUpdateRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              maxLength: 255,
              example: 'Updated: Summer Volunteer Drive 2026',
            },
            message: {
              type: 'string',
              maxLength: 2000,
              example: 'Updated details for the summer volunteer drive...',
            },
            type: {
              type: 'string',
              enum: ['general', 'program', 'emergency', 'maintenance', 'event', 'recruitment', 'system'],
              example: 'recruitment',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              example: 'high',
            },
            targetAudience: {
              type: 'string',
              enum: ['all_users', 'volunteers', 'ngos', 'admins', 'specific_users'],
              example: 'all_users',
            },
            specificUsers: {
              type: 'array',
              items: { type: 'string' },
              example: ['665f1b2c3d4e5f6789abcdeg'],
            },
            scheduledAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-10T00:00:00.000Z',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-31T23:59:59.000Z',
            },
            attachments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'brochure.pdf' },
                  url: { type: 'string', example: 'https://dishaforindia.org/files/brochure.pdf' },
                  type: { type: 'string', default: 'file' },
                  size: { type: 'integer', example: 1048576 },
                },
              },
            },
            status: {
              type: 'string',
              enum: ['draft', 'scheduled', 'published', 'expired', 'archived'],
              example: 'published',
            },
          },
        },

        // ─── Role ─────────────────────────────────────────────
        Role: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdef',
            },
            roleId: {
              type: 'string',
              example: 'ROLE0001',
            },
            name: {
              type: 'string',
              example: 'Admin',
            },
            slug: {
              type: 'string',
              example: 'admin',
            },
            description: {
              type: 'string',
              example: 'System administrator role',
            },
            permissions: {
              type: 'array',
              items: {
                type: 'string',
                example: 'users:read',
              },
            },
            isSystemRole: {
              type: 'boolean',
              example: true,
            },
            isActive: {
              type: 'boolean',
              example: true,
            },
          },
        },

        // ─── Permission ─────────────────────────────────────
        Permission: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdef',
            },
            permissionId: {
              type: 'string',
              example: 'PERM0001',
            },
            module: {
              type: 'string',
              example: 'users',
            },
            action: {
              type: 'string',
              example: 'read',
            },
            code: {
              type: 'string',
              example: 'users:read',
            },
            description: {
              type: 'string',
              example: 'Read user information',
            },
            category: {
              type: 'string',
              example: 'crud',
            },
            isSystemPermission: {
              type: 'boolean',
              example: true,
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication & Session Management',
      },
      {
        name: 'Users',
        description: 'User Management & Profiles',
      },
      {
        name: 'Admin',
        description: 'Admin — User Management & Dashboard Statistics',
      },
      {
        name: 'Attendance',
        description: 'Volunteer Attendance Management',
      },
      {
        name: 'Health',
        description: 'Server health monitoring',
      },
      {
        name: 'Programs',
        description: 'Program Management',
      },
      {
        name: 'Applications',
        description: 'Volunteer Applications Management',
      },
      {
        name: 'Certificates',
        description: 'Volunteer Certificate Management',
      },
      {
        name: 'Leaderboard',
        description: 'Volunteer Leaderboard Foundation',
      },
      {
        name: 'Gamification',
        description: 'Badges, Achievements & Volunteer Levels',
      },
      {
        name: 'Rewards',
        description: 'Volunteer Reward Profiles & Balances',
      },
      {
        name: 'Notifications',
        description: 'Notification Foundation — In-App Notifications',
      },
      {
        name: 'Announcements',
        description: 'Announcement Management — Create, Publish, and Manage Announcements',
      },
      {
        name: 'Organization',
        description: 'Organization Management — Multi-tenancy Foundation',
      },
      {
        name: 'Roles',
        description: 'Role Management',
      },
      {
        name: 'Permissions',
        description: 'Permission Management',
      },
    ],
  },
    // Paths to files containing JSDoc swagger annotations
    apis: [
      './src/modules/auth/auth.routes.js',
      './src/docs/auth.docs.js',
      './src/docs/health.docs.js',
      './src/docs/user.docs.js',
      './src/docs/admin.docs.js',
      './src/docs/program.docs.js',
      './src/docs/application.docs.js',
      './src/docs/attendance.docs.js',
      './src/docs/certificates.docs.js',
      './src/docs/leaderboard.docs.js',
      './src/docs/gamification.docs.js',
      './src/docs/rewards.docs.js',
      './src/docs/notification.docs.js',
      './src/docs/organization.docs.js',
      './src/docs/announcement.docs.js',
      './src/docs/roles.docs.js',
      './src/docs/permission.docs.js',
      './src/docs/contribution.docs.js',
    ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
