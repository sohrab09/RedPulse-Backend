function getPagination(page = 1, limit = 10) {
    const currentPage = Number.isInteger(Number(page)) ? Math.max(Number(page), 1) : 1;
    const pageSize = Number.isInteger(Number(limit)) ? Math.max(Number(limit), 1) : 10;
    const offset = (currentPage - 1) * pageSize;

    return { page: currentPage, limit: pageSize, offset };
}

function getPagingData({ count, rows }, page, limit) {
    const totalItems = Array.isArray(rows) ? count : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
        users: rows,
    };
}

module.exports = {
    getPagination,
    getPagingData,
};
