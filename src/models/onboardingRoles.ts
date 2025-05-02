import mongoose, { Schema, Document } from 'mongoose';

// Define interface for TypeScript
interface IOnboardingRoles extends Document {
    userId: string;
    roles: string[];
}

// Define Mongoose schema
const onboardingRolesSchema = new Schema<IOnboardingRoles>({
    userId: { type: String, required: true, unique: true },
    roles: { type: [String], required: true }
});

// Create Mongoose model
const OnboardingRoles = mongoose.model<IOnboardingRoles>('OnboardingRoles', onboardingRolesSchema);

export async function setOnboardingRoles(userId: string, roles: string[]) {
    try {
        await OnboardingRoles.findOneAndUpdate(
            { userId },
            { userId, roles },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error(`Failed to set roles for user ${userId}:`, error);
        throw error;
    }
}

export async function getOnboardingRoles(userId: string): Promise<string[] | undefined> {
    try {
        const doc = await OnboardingRoles.findOne({ userId });
        return doc ? doc.roles : undefined;
    } catch (error) {
        console.error(`Failed to get roles for user ${userId}:`, error);
        throw error;
    }
}

export async function deleteOnboardingRoles(userId: string) {
    try {
        await OnboardingRoles.deleteOne({ userId });
    } catch (error) {
        console.error(`Failed to delete roles for user ${userId}:`, error);
        throw error;
    }
}