import dns from 'dns';
import mongoose from 'mongoose';

// Fix for Windows Node.js querySrv EBADRESP when resolving MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}
import { config } from '../config';
import { User } from '../models/User';
import { Tenant } from '../models/Tenant';

/**
 * Script to create or update the Platform Admin user account.
 *
 * Usage:
 *   pnpm --filter @acadflows/api run create:platform-admin [password] [email]
 *
 * Example:
 *   pnpm --filter @acadflows/api run create:platform-admin Admin@123 acadflows00@gmail.com
 */
async function main() {
  const targetEmail =
    process.argv[3] || config.platformAdmin.email || 'acadflows00@gmail.com';
  const targetPassword = process.argv[2] || 'AcadFlows#2026$FounderAdmin!';
  const firstName = 'AcadFlows';
  const lastName = 'Founder';

  console.log('───────────────────────────────────────────────────────');
  console.log('🚀 AcadFlows Platform Admin Setup');
  console.log('───────────────────────────────────────────────────────');
  console.log(`Target Email : ${targetEmail}`);
  console.log(`Password     : ${targetPassword}`);

  try {
    try {
      await mongoose.connect(config.mongodb.uri);
    } catch (connErr: any) {
      if (connErr.message?.includes('EBADRESP') && config.mongodb.uri.includes('acadflows.rmo9pl9.mongodb.net')) {
        const directUri = 'mongodb://anuragakn18_db_user:iqzNHD17Q1cGbob1@ac-fsllifp-shard-00-00.rmo9pl9.mongodb.net:27017,ac-fsllifp-shard-00-01.rmo9pl9.mongodb.net:27017,ac-fsllifp-shard-00-02.rmo9pl9.mongodb.net:27017/AcadFlows-V1?ssl=true&authSource=admin&retryWrites=true&w=majority';
        await mongoose.connect(directUri);
      } else {
        throw connErr;
      }
    }
    console.log('✅ Connected to MongoDB');

    // 1. Ensure a platform tenant exists for the super admin
    let platformTenant = await Tenant.findOne({ slug: 'platform' });
    if (!platformTenant) {
      platformTenant = await Tenant.create({
        name: 'AcadFlows Platform Administration',
        slug: 'platform',
        address: 'AcadFlows HQ',
        phone: '+91 9999999999',
        email: targetEmail,
        status: 'active',
        emailVerified: true,
      });
      console.log(`✅ Created Platform Tenant (${platformTenant._id})`);
    }

    // 2. Check if platform admin user already exists
    let user = await User.findOne({ email: targetEmail.toLowerCase().trim() });

    if (user) {
      user.passwordHash = targetPassword; // User pre-save hook will hash this
      user.role = 'admin';
      user.status = 'active';
      user.emailVerified = true;
      user.tenantId = platformTenant._id.toString();
      await user.save();
      console.log(`✅ Updated existing user "${targetEmail}" to active Platform Admin!`);
    } else {
      user = await User.create({
        tenantId: platformTenant._id.toString(),
        email: targetEmail.toLowerCase().trim(),
        passwordHash: targetPassword, // User pre-save hook hashes this
        firstName,
        lastName,
        role: 'admin',
        status: 'active',
        emailVerified: true,
        phone: '+91 9999999999',
      });
      console.log(`✅ Created new Platform Admin user (${user._id})!`);
    }

    console.log('───────────────────────────────────────────────────────');
    console.log('🎉 Platform Admin setup complete!');
    console.log(`You can now sign in at http://localhost:5173/login with:`);
    console.log(`  Email   : ${targetEmail}`);
    console.log(`  Password: ${targetPassword}`);
    console.log('───────────────────────────────────────────────────────');
  } catch (err) {
    console.error('❌ Failed to set up platform admin:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
