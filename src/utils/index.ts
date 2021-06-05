import { anyObject } from '../@types';

export const paginateData = (pageNo: string, pageSize: string) => {
	let _pageNo = parseInt(pageNo);
	let _pageSize = parseInt(pageSize);
	const query: anyObject = {};

	if (!pageNo || _pageNo < 0) _pageNo = 1;

	if (!pageSize || _pageSize < 0) _pageSize = 10;

	query.skip = _pageSize * (_pageNo - 1);
	query.limit = _pageSize;

	return query;
};
