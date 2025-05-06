import mongoose from 'mongoose';

export async function main() {
    mongoose.connect(process.env.MONGO_URI);
}