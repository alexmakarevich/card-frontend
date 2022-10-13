import {CardData} from "./Card";

import {createUseStyles} from "react-jss";
import {Theme} from "../styling/theme";
import {CardCollection} from "./CardCollection";
import {ChangeEvent, useEffect, useMemo, useState} from "react";
import Fuse from "fuse.js";
import {ReactComponent as SearchIcon} from "./../media/icons/search-icon.svg";

interface CardPageProps {
	data: CardData[];
}

const useStyles = createUseStyles(
	(theme: Theme) => ({
		wrapper: {
			background: theme.background,
			width: "100%",
			textAlign: "center",
			minHeight: "100vh",
		},
		menu: {
			background: "#FFF",
			color: theme.textAccent,
			fontSize: "0.75rem",
			display: "inline-flex",
			width: "100%",
			justifyContent: "space-between",
			flexWrap: "wrap",
			padding: 15,
			borderRadius: 10,
			alignItems: "center",
		},
		header: {
			textAlign: "center",
			flexDirection: "column",
			background: `linear-gradient(180deg, ${theme.primaryVariant} 180px, ${theme.background}  180px)`,
		},
		topContainer: {
			maxWidth: 920,
			minWidth: 320,
			padding: 15,
			width: "100%",
			textAlign: "center",
			display: "inline-block",
		},
		h1: {
			color: "white",
			textAlign: "left",
			paddingTop: 50,
		},
		searchContainer: {
			display: "flex",
			alignItems: "center",
		},
		search: {
			border: "none",
			margin: [0, 10],
		},
		searchIcon: {
			width: 25,
		},
		sort: {
			border: "none",
			color: theme.textAccent,
		},
		label: {
			cursor: "pointer",
			color: theme.textAccent,
			margin: [0, 10],
			display: "flex",
			alignItems: "center",
		},
		checkbox: {},
	}),
	{name: "CardPage"}
);

const sortOptions = [
	{key: "unsorted", value: "Unsorted"},
	{key: "authorAZ", value: "Author Last Name A-Z"},
	{key: "authorZA", value: "Author Last Name Z-A"},
	{key: "dateEarliest", value: "Date Earlies First"},
	{key: "dateLatest", value: "Date Latest First"},
] as const;

const pickSorter = (sortOpt: typeof sortOptions[number]["key"]): ((a: CardData, b: CardData) => number) =>
	sortOpt === "unsorted"
		? () => 1
		: sortOpt === "authorZA"
		? (a, b) => a.authorName.last.localeCompare(b.authorName.last)
		: sortOpt === "authorAZ"
		? (a, b) => b.authorName.last.localeCompare(a.authorName.last)
		: sortOpt === "dateLatest"
		? (a, b) => a.dateAdded.valueOf() - b.dateAdded.valueOf()
		: sortOpt === "dateEarliest"
		? (a, b) => b.dateAdded.valueOf() - a.dateAdded.valueOf()
		: (a, b) => 1;

export const CardPage = ({data}: CardPageProps) => {
	const classes = useStyles();

	const [cards, setCards] = useState(data);
	const [isLatest, setIsLatest] = useState(false);
	const [sortState, setSortState] = useState<typeof sortOptions[number]["key"]>(sortOptions[0].key);
	const [search, setSearch] = useState("");
	// fake likes, since the backend doesn't do much
	const [areLiked, setAreLiked] = useState<number[]>([]);

	const fuse = useMemo(
		() =>
			new Fuse(data, {
				keys: ["title", "authorName.last", "authorName.first"],
			}),
		[data]
	);

	const thisYear = new Date().getFullYear();

	// actually filtering data here
	useEffect(() => {
		setCards((cards) => {
			const cardsAfterSearch = search === "" ? data : fuse.search(search).map((res) => res.item);
			return (
				isLatest ? cardsAfterSearch.filter((card) => card.dateAdded.getFullYear() === thisYear) : cardsAfterSearch
			)
				.sort(pickSorter(sortState))
				.map((c) => (areLiked.includes(c.id) ? {...c, isLiked: true, likes: c.likes + 1} : c));
		});
	}, [isLatest, thisYear, sortState, data, search, fuse, areLiked]);

	return (
		<div className={classes.wrapper}>
			<header className={classes.header}>
				<div className={classes.topContainer}>
					<h1 className={classes.h1}>dev articles</h1>
					<menu className={classes.menu}>
						<label className={classes.searchContainer}>
							<SearchIcon className={classes.searchIcon} />
							<input
								type="search"
								className={classes.search}
								placeholder="Filter by title, author..."
								onChange={(e) => setSearch(e.target.value)}
							/>
						</label>
						<Dropdown
							className={classes.sort}
							value={sortState}
							options={sortOptions}
							onChange={(e) => setSortState(e.target.value)}
						/>
						<label className={classes.label}>
							<input type="checkbox" onChange={() => setIsLatest((isLatest) => !isLatest)} checked={isLatest} />
							Latest Only
						</label>
					</menu>
				</div>
			</header>
			<CardCollection
				data={cards}
				onLike={(id: number) => {
					const index = areLiked.findIndex((n) => n === id);
					if (index > -1) {
						setAreLiked((areLiked) => [...areLiked.slice(0, index), ...areLiked.slice(index + 1)]);
					} else {
						setAreLiked([...areLiked, id]);
					}
				}}
			/>
		</div>
	);
};

const Dropdown = ({
	value,
	options,
	onChange,
	className,
}: {
	className?: string;
	value: string;
	options: readonly {readonly key: string; readonly value: string}[];
	onChange: (e: ChangeEvent<any>) => any;
}) => {
	return (
		<label>
			<select value={value} onChange={onChange} className={className}>
				{options.map((option) => (
					<option value={option.key} key={option.key}>
						{option.value}
					</option>
				))}
			</select>
		</label>
	);
};
