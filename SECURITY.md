# Security Documentation - Eburon Home

## Overview

This document outlines the security measures, policies, and best practices implemented across the Eburon Home property management system.

## 🔐 Authentication & Authorization

### Authentication Strategy
- **JWT-based authentication** for stateless API
- **bcrypt** for password hashing (cost factor: 10)
- **Token expiration**: 7 days (configurable)
- **Refresh token** mechanism for long-lived sessions

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Role-Based Access Control (RBAC)

#### Role Hierarchy
1. **ADMIN**: Full system access
2. **CONTRACTOR**: Maintenance request management
3. **OWNER**: Property viewing and health monitoring
4. **BROKER**: Property viewing and client contact
5. **TENANT**: Property search and maintenance requests

#### Permission Matrix

| Resource | ADMIN | CONTRACTOR | OWNER | BROKER | TENANT |
|----------|-------|------------|-------|--------|--------|
| User Management | RW | - | - | - | - |
| All Properties | RW | R | R (own) | R (own) | R |
| Create Property | W | - | - | - | - |
| All Maintenance | RW | RW (assigned) | R (own props) | R (own props) | RW (own) |
| Assign Contractor | W | - | - | - | - |

## 🛡️ API Security

### Input Validation
- **Zod schemas** for all request payloads
- **Type checking** via TypeScript
- **Sanitization** of user inputs
- **File upload validation**:
  - Max size: 5MB
  - Allowed types: JPEG, PNG, WebP
  - Virus scanning (production)

### SQL Injection Prevention
- **Prisma ORM** with parameterized queries
- **No raw SQL** in application code
- **Input validation** before database operations

### Rate Limiting
```javascript
// Authentication endpoints: 5 requests per 15 minutes
// General API: 100 requests per 15 minutes
// Search: 50 requests per minute
```

### Security Headers (helmet.js)
```javascript
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}
```

### CORS Configuration
```javascript
{
  origin: [
    'https://adminhome.eburon.ai',
    'https://homiesearch.eburon.ai',
    'http://localhost:3001', // Dev only
    'http://localhost:3002'  // Dev only
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

## 🗄️ Database Security

### Connection Security
- **SSL/TLS** for production database connections
- **Connection pooling** with max connections limit
- **Prepared statements** via Prisma

### Data Protection
- **Passwords**: bcrypt hashed, never stored in plain text
- **Tokens**: JWT signed with secret key
- **PII**: Logged with care, never in production logs
- **Audit logs**: Track all critical operations

### Backup Strategy
- **Daily automated backups** of production database
- **Point-in-time recovery** enabled
- **Encrypted backups** stored in secure location
- **Retention**: 30 days for daily, 12 months for monthly

### Database User Permissions
```sql
-- Application user: limited permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
REVOKE DROP, TRUNCATE ON ALL TABLES IN SCHEMA public FROM app_user;

-- Migration user: schema modifications only
GRANT ALL PRIVILEGES ON SCHEMA public TO migration_user;
```

## 🐳 Docker Security

### Container Security
- **Non-root users** in all containers
- **Read-only file systems** where possible
- **Minimal base images** (Alpine Linux)
- **No secrets in images** (use environment variables)
- **Regular image updates** for security patches

### Docker Compose Security
- **Secrets management** via environment files
- **Network isolation** between services
- **Health checks** for all services
- **Resource limits** to prevent DoS

### Production Dockerfile Best Practices
```dockerfile
# Multi-stage builds to reduce attack surface
FROM node:20-alpine AS build
# ... build stage

FROM node:20-alpine AS production
USER node
WORKDIR /app
COPY --chown=node:node --from=build /app/dist ./dist
```

## 🌐 Frontend Security

### XSS Prevention
- **React** automatically escapes content
- **No dangerouslySetInnerHTML** unless absolutely necessary
- **Content Security Policy** headers
- **Sanitize** user-generated content before rendering

### CSRF Protection
- **SameSite cookies** for sessions
- **CSRF tokens** for state-changing operations
- **Double-submit cookie** pattern

### Secure Storage
- **JWT in httpOnly cookies** (production)
- **No sensitive data** in localStorage
- **Session timeout** after inactivity

### Third-Party Dependencies
- **Regular updates** via dependabot
- **Vulnerability scanning** with npm audit
- **License compliance** checking

## 📧 Email Security

### SMTP Configuration
- **TLS/SSL** encryption required
- **DKIM** and **SPF** records configured
- **Rate limiting** on email sends
- **Template validation** to prevent injection

### Email Content Security
- **No user input** in email subjects
- **Sanitize** user input in email bodies
- **Plain text alternatives** for all HTML emails
- **Unsubscribe links** in all marketing emails

## 🔑 Secrets Management

### Development
```bash
# .env file (never committed)
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### Production
- **AWS Secrets Manager** or equivalent
- **Environment variables** injected at runtime
- **Rotation policy** for sensitive credentials
- **Least privilege** access to secrets

### Secret Rotation Schedule
- **JWT_SECRET**: Every 90 days
- **Database passwords**: Every 90 days
- **API keys**: Every 180 days
- **SMTP credentials**: Every 180 days

## 🚨 Incident Response

### Security Incident Procedure
1. **Detect**: Monitoring alerts trigger investigation
2. **Contain**: Isolate affected systems
3. **Assess**: Determine scope and impact
4. **Remediate**: Apply fixes and patches
5. **Review**: Post-mortem analysis
6. **Document**: Update security policies

### Monitoring & Alerts
- **Failed login attempts** (> 5 in 15 minutes)
- **Unusual API access patterns**
- **Database connection errors**
- **High error rates**
- **Unauthorized access attempts**

## 📊 Logging & Auditing

### Log Levels
- **ERROR**: System errors, exceptions
- **WARN**: Deprecations, validation failures
- **INFO**: User actions, API calls (production)
- **DEBUG**: Detailed flow (development only)

### Audit Trail
Track all critical operations:
- User login/logout
- User creation/deletion
- Role changes
- Property creation/modification
- Maintenance request status changes
- Contractor assignments

### Log Retention
- **Application logs**: 30 days
- **Audit logs**: 365 days
- **Security logs**: 730 days

## 🔍 Vulnerability Management

### Regular Security Audits
- **Weekly**: npm audit for dependency vulnerabilities
- **Monthly**: Docker image scanning
- **Quarterly**: Penetration testing
- **Annual**: Third-party security audit

### Patch Management
- **Critical vulnerabilities**: Within 24 hours
- **High vulnerabilities**: Within 7 days
- **Medium vulnerabilities**: Within 30 days
- **Low vulnerabilities**: Next release cycle

## ✅ Security Checklist

### Pre-Deployment
- [ ] All dependencies updated and scanned
- [ ] Environment variables properly configured
- [ ] Secrets rotated and stored securely
- [ ] HTTPS/TLS certificates valid
- [ ] Database backups configured and tested
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Authentication flow tested
- [ ] Authorization rules verified
- [ ] Input validation comprehensive
- [ ] File upload restrictions enforced
- [ ] Logging and monitoring active
- [ ] Incident response plan documented

### Regular Maintenance
- [ ] Weekly dependency updates
- [ ] Monthly security patches
- [ ] Quarterly penetration tests
- [ ] Annual security audit
- [ ] Log review (weekly)
- [ ] Backup verification (weekly)
- [ ] Access review (monthly)
- [ ] Secret rotation (per schedule)

## 📞 Security Contacts

- **Security Team**: security@eburon.ai
- **Incident Response**: incidents@eburon.ai
- **Emergency Hotline**: [To be configured]

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)

---

**Last Updated**: 2025-11-27  
**Version**: 1.0  
**Owner**: Alex (Security Lead)
