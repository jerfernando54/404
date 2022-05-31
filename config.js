const config = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'http://localhost',
    publicRoute: process.env.PUBLIC_ROUTER || '/app',
    filesRoute:process.env.FILES_ROUTE || 'files',
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        database: process.env.MYSQL_DB || 'db_404',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASS || '',
    }
}

module.exports = config;