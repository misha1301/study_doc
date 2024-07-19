const mongoose = require("mongoose");

const connectDB = async (): Promise<void> => {
    try {
        mongoose.connect(process.env.DATABASE_LOCAL_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;
// module.exports = connectDB;
