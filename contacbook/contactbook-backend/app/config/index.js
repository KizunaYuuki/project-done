const config = {
    app: {
        port: process.env.PORT || 3000
    },
    db: {
        // uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/contactbook" // connection string, may use connection string on mongo als.. to 
        uri: process.env.MONGODB_URI || "mongodb+srv://mongo:mongo@cluster0.5dw7dn2.mongodb.net/?retryWrites=true&w=majority"
    }
};
module.exports = config;