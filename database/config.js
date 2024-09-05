import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CNN, {
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
