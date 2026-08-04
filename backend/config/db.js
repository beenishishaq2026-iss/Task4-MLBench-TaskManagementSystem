const mongoose = require('mongoose');

let cached = global._mongooseConn;

if (!cached) {
    cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_URI, {
                bufferCommands: false,
            })
            .then((mongooseInstance) => {
                console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
                return mongooseInstance;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
    }

    return cached.conn;
};

module.exports = connectDB;