const mongoose = require("mongoose");

const connectDB = async (): Promise<void> => {
    try {
        mongoose.connect(process.env.DATABASE_LOCAL_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
    } catch (error) {
        console.error(error);
    }
};

export default connectDB;
// module.exports = connectDB;
