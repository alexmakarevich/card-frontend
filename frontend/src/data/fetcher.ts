import {useState, useEffect} from "react";
import {CardData} from "../components/Card";

export const useCards = () => {
	const data = useFetch("http://localhost:8888/cards");

	return data
		? data.map<CardData>((c) => {
				const {id, images, author, likes, dateAdded, title} = c;

				const firstLast = author.split(" ");

				return {
					title,
					id: id,
					authorName: {
						first: firstLast[0],
						last: firstLast[1],
					},
					images,
					likes,
					dateAdded: new Date(dateAdded),
					isLiked: false, // TODO: see if enough time to write to backend
				};
		  })
		: undefined;
};

export const useFetch = (url: string) => {
	const [data, setData] = useState<CardDataFromApi[] | undefined>(undefined);

	useEffect(() => {
		async function fetchData() {
			const response = await fetch(url);
			const result = await response.json();
			setData(result);
		}

		fetchData();
	}, [url]);
	return data;
};

export interface CardDataFromApi {
	id: number;
	author: string;
	title: string;
	dateAdded: `${number}-${number}-${number}`;
	images: {
		portrait: string[];
		landscape: string[];
	}[];
	likes: number;
}
