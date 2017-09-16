var config = {
    mysqldb: {
        host: "localhost",
        user: "travenas",
        password: "Ing4ighi",
        database: "travenas"
    }
};

if (typeof process.env.MYSQL_HOST !== "undefined" && process.env.MYSQL_HOST !== null) {
    config = {
        mysqldb: {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB
        }
    };
}

module.exports = config;