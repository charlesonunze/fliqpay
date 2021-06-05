import { writeFile } from 'fs';
import { anyObject } from '../@types';
import { parseAsync } from 'json2csv';
import pdf from 'html-pdf';

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

export const getReportHTML = (arr: any[]) => {
	let html = '<html>';

	html += `
    <head>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      td, th {
        text-align: left;
        padding: 8px;
      }

      </style>
    </head>
  `;

	html += `<table>`;

	const headers = Object.keys(arr[0]);

	html += `
    <tr>
      <th>${headers[1]}</th>
      <th>${headers[2]}</th>
      <th>${headers[3]}</th>
      <th>${headers[4]}</th>
    </tr>
  `;

	for (let i = 0; i < arr.length; i++) {
		const ticket = arr[i];

		html += `
      <tr>
        <th>${ticket['Title']}</th>
        <th>${ticket['Description']}</th>
        <th>${ticket['Status']}</th>
        <th>${ticket['Date Closed']}</th>
      </tr>
    `;
	}

	html += '</table> </html>';

	return html;
};

export const toCSV = async (data: any[]) => {
	const fields = ['Title', 'Description', 'Status', 'Date Closed'];
	const opts = { fields };

	try {
		const csv = await parseAsync(data, opts);
		return csv;
	} catch (err) {
		throw new Error(err);
	}
};

export const toPDF = (html: string, filePath: string) => {
	return new Promise((resolve, reject) => {
		pdf.create(html).toFile(filePath, function (err, res) {
			if (err) return reject(err.message);
			resolve(res);
		});
	});
};

export const saveFile = (filePath: string, data: any) => {
	return new Promise((resolve, reject) => {
		writeFile(filePath, data, (err) => {
			if (err) return reject(err.message);
			resolve(true);
		});
	});
};

export const genRandNum = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min) + min);
};
