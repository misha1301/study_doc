const mongoose = require("mongoose");

const connectDB = async (): Promise<void> => {
    try {
        mongoose.connect(
            process.env.NODE_ENV == "test"? process.env.DATABASE_TEST_URL : process.env.DATABASE_LOCAL_URL,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            });
    } catch (error) {
        console.error(error);
    }
};

export default connectDB;
// module.exports = connectDB;
