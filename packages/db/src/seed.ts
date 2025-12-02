import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  const hashedPassword = await bcrypt.hash('Admin123!', Number(process.env.SALT_ROUNDS) || 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@eburon.ai',
      password: hashedPassword,
      name: 'System Administrator',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('Created admin user:', adminUser.email);

  const contractorPassword = await bcrypt.hash('Contractor123!', 10);
  const contractorUser = await prisma.user.create({
    data: {
      email: 'contractor@eburon.ai',
      password: contractorPassword,
      name: 'John Contractor',
      role: UserRole.CONTRACTOR,
      isActive: true,
      contractorProfile: {
        create: {
          company: 'Eburon Maintenance Services',
          skills: 'Plumbing, Electrical, HVAC',
        },
      },
    },
    include: {
      contractorProfile: true,
    },
  });

  console.log('Created contractor user:', contractorUser.email);

  const ownerPassword = await bcrypt.hash('Owner123!', 10);
  const ownerUser = await prisma.user.create({
    data: {
      email: 'owner@eburon.ai',
      password: ownerPassword,
      name: 'Sarah Owner',
      role: UserRole.OWNER,
      isActive: true,
      ownerProfile: {
        create: {},
      },
    },
    include: {
      ownerProfile: true,
    },
  });

  console.log('Created owner user:', ownerUser.email);

  const property1 = await prisma.property.create({
    data: {
      title: 'Modern Apartment in Brussels City Center',
      description:
        'Beautiful 2-bedroom apartment with stunning city views. Recently renovated with high-quality finishes. Walking distance to Grand Place and central station.',
      addressLine1: 'Rue de la Loi 123',
      city: 'Brussels',
      region: 'Brussels-Capital',
      country: 'Belgium',
      postalCode: '1000',
      latitude: 50.8503,
      longitude: 4.3517,
      pricePerMonth: 1500,
      currency: 'EUR',
      bedrooms: 2,
      bathrooms: 1,
      areaSqm: 85,
      amenities: ['Balcony', 'Elevator', 'Parking', 'Central Heating'],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      ],
      status: 'PUBLISHED',
      ownerId: ownerUser.ownerProfile?.id,
    },
  });

  console.log('Created property:', property1.title);

  const tenantPassword = await bcrypt.hash('Tenant123!', 10);
  const tenantUser = await prisma.user.create({
    data: {
      email: 'tenant@eburon.ai',
      password: tenantPassword,
      name: 'Mike Tenant',
      role: UserRole.TENANT,
      isActive: true,
      tenantProfile: {
        create: {},
      },
    },
    include: {
      tenantProfile: true,
    },
  });

  console.log('Created tenant user:', tenantUser.email);

  const lease = await prisma.lease.create({
    data: {
      propertyId: property1.id,
      tenantId: tenantUser.tenantProfile!.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true,
    },
  });

  console.log('Created lease for tenant');

  console.log('\nSeed completed successfully!');
  console.log('\nDefault login credentials:');
  console.log('Admin: admin@eburon.ai / Admin123!');
  console.log('Contractor: contractor@eburon.ai / Contractor123!');
  console.log('Owner: owner@eburon.ai / Owner123!');
  console.log('Tenant: tenant@eburon.ai / Tenant123!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
