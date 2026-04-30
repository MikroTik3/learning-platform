import { QueryPaginationRequest } from '../dtos'

export function paginate(query: Record<string, any>, options?: QueryPaginationRequest) {
	const page = Number(query.page) > 0 ? Number(query.page) : 1
	const limit = Number(query.limit) > 0 ? Number(query.limit) : 20

	const prismaQuery: any = {
		skip: (page - 1) * limit,
		take: limit
	}

	if (query.sortBy) {
		prismaQuery.orderBy = {
			[query.sortBy]: query.sortOrder === 'desc' ? 'desc' : 'asc'
		}
	}

	const where: any = {}

	if (query.search && options?.searchFields?.length) {
		where.OR = options.searchFields.map(field => ({
			[field]: { contains: query.search, mode: 'insensitive' }
		}))
	}

	if (query.filters) {
		Object.assign(where, query.filters)
	}

	if (query.role) {
		where.role = query.role
	}

	if (Object.keys(where).length > 0) {
		prismaQuery.where = where
	}

	return {
		prismaQuery,
		page,
		limit
	}
}
