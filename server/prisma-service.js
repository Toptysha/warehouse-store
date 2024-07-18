const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

prismaClient.$connect();

module.exports.prismaClient = prismaClient;